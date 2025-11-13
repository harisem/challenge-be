import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FindAllCompaniesDto } from './dto/company.dto';
// import * as ExcelJS from 'exceljs';
// import { Readable } from 'stream';
// import { Company } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindAllCompaniesDto) {
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
        this.prisma.company.findMany({
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
        this.prisma.company.count({
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

      // const res = await this.prisma.company.findMany({
      //   where: { is_deleted: 0 },
      // });

      response.message = 'Companies Data.';
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
      const res = await this.prisma.company.findUnique({
        where: { id, is_deleted: 0 },
      });

      if (!res) {
        response.status = HttpStatus.NOT_FOUND;
        response.message = 'No data found.';
        response.data = res;
      } else {
        response.message = 'Company Data.';
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
      const createdData = await this.prisma.company.create({
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
        response.message = 'User created successfully';
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
      const createdData = await this.prisma.company.update({
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

  async delete(id: string, context) {
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
      const createdData = await this.prisma.company.update({
        where: { id },
        data: {
          delete_by: context.username,
          delete_date: new Date(),
          is_deleted: 1,
        },
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

  // async generateExcel(companies: any[]): Promise<NodeJS.ReadableStream> {
  //   const workbook = new ExcelJS.Workbook();
  //   const allCompanies = companies.map((c: Company) => c.name);

  //   const sheet2 = workbook.addWorksheet('All Companies');
  //   sheet2.addRow(['Company Name']);
  //   allCompanies.forEach((name) => sheet2.addRow([name]));

  //   const sheet1 = workbook.addWorksheet('Selected Companies');
  //   sheet1.addRow(['Company Name', 'Add Another Company']);
  //   const firstTen = allCompanies.slice(0, 10);
  //   firstTen.forEach((name) => {
  //     const row = sheet1.addRow([name, '']);
  //     row.getCell(2).dataValidation = {
  //       type: 'list',
  //       allowBlank: true,
  //       formulae: [`'All Companies'!$A$2:$A$${allCompanies.length + 1}`],
  //       showErrorMessage: true,
  //       errorTitle: 'Invalid company',
  //       error: 'Please select a company from the list',
  //     };
  //   });

  //   const buffer = await workbook.xlsx.writeBuffer();
  //   return Readable.from(buffer as any);
  // }
}
