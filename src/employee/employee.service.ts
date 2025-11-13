import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FindAllEmployeesDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindAllEmployeesDto) {
    const response: {
      status: number;
      message: string;
      data: object[] | null;
      meta: object;
    } = {
      status: HttpStatus.OK,
      message: '',
      data: null,
      meta: {},
    };

    try {
      const { search, page = 1, limit = 20 } = query;

      const { skip, take } = {
        skip: (page - 1) * limit,
        take: Number(limit),
      };

      const [result, count] = await this.prisma.$transaction([
        this.prisma.employee.findMany({
          where: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
            is_deleted: 0,
          },
          orderBy: {
            created_date: 'asc',
          },
          skip,
          take,
        }),
        this.prisma.employee.count({
          where: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
            is_deleted: 0,
          },
        }),
      ]);

      const meta: {
        page: number;
        limit: number;
        total_data_page: number;
        total_data: number;
      } = {
        page: +page,
        limit: +limit,
        total_data_page: Math.ceil(count / limit),
        total_data: count ? count : 0,
      };

      response.message = 'Employees Data.';
      response.data = result;
      response.meta = meta;

      return response;
    } catch (error) {
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof Error) {
        response.message = error.message ?? 'Internal Server Error.';
      } else {
        response.message = 'Internal Server Error.';
      }

      return response;
    }
  }

  async findOne(id: string) {
    const response: {
      status: number;
      message: string;
      data: object | null;
    } = {
      status: HttpStatus.OK,
      message: '',
      data: null,
    };

    try {
      const res = await this.prisma.employee.findUnique({
        where: { id, is_deleted: 0 },
      });

      if (!res) {
        response.status = HttpStatus.NOT_FOUND;
        response.message = 'No data found.';
        response.data = res;
      } else {
        response.message = 'Employee Data.';
        response.data = res;
      }

      return response;
    } catch (error) {
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof Error) {
        response.message = error.message ?? 'Internal Server Error.';
      } else {
        response.message = 'Internal Server Error.';
      }

      return response;
    }
  }

  async create(data: { name: string; code: string }) {
    const response: {
      status: number;
      message: string;
      data: object | null;
    } = {
      status: HttpStatus.OK,
      message: '',
      data: null,
    };

    try {
      const createdData = await this.prisma.employee.create({
        data: {
          code: data.code,
          name: data.name,
          created_by: 'admin',
        },
      });
      if (Object.keys(createdData).length < 1) {
        response.status = HttpStatus.BAD_REQUEST;
        response.message = 'Failed to store.';
        response.data = null;
      } else {
        response.status = HttpStatus.CREATED;
        response.message = 'Employee created successfully';
        response.data = createdData;
      }
    } catch (error) {
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof Error) {
        response.message = error.message ?? 'Internal Server Error.';
      } else {
        response.message = 'Internal Server Error.';
      }
    }

    return response;
  }

  async update(id: string, data: { name: string }) {
    const response: {
      status: number;
      message: string;
      data: object | null;
    } = {
      status: HttpStatus.OK,
      message: '',
      data: null,
    };

    try {
      const createdData = await this.prisma.employee.update({
        where: { id, is_deleted: 0 },
        data,
      });
      if (Object.keys(createdData).length < 1) {
        response.status = HttpStatus.BAD_REQUEST;
        response.message = 'Failed to update.';
        response.data = null;
      } else {
        response.status = HttpStatus.OK;
        response.message = 'Data updated successfully.';
        response.data = createdData;
      }
    } catch (error) {
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof Error) {
        response.message = error.message ?? 'Internal Server Error.';
      } else {
        response.message = 'Internal Server Error.';
      }
    }

    return response;
  }

  async delete(id: string) {
    const response: {
      status: number;
      message: string;
      data: object | null;
    } = {
      status: HttpStatus.OK,
      message: '',
      data: null,
    };

    try {
      const createdData = await this.prisma.employee.update({
        where: { id },
        data: { is_deleted: 1 },
      });
      if (Object.keys(createdData).length < 1) {
        response.status = HttpStatus.BAD_REQUEST;
        response.message = 'Failed to delete.';
        response.data = null;
      } else {
        response.status = HttpStatus.OK;
        response.message = 'Data deleted successfully.';
        response.data = createdData;
      }
    } catch (error) {
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (error instanceof Error) {
        response.message = error.message ?? 'Internal Server Error.';
      } else {
        response.message = 'Internal Server Error.';
      }
    }

    return response;
  }
}
