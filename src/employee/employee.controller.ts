import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateEmployeeDto, FindAllEmployeesDto } from './dto/employee.dto';
import { JoiPipe } from 'nestjs-joi';

@ApiTags('Employee')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private employee: EmployeeService) {}

  @Get('/findEmployee')
  // @Roles('ADMIN', 'MANAGER', 'BASIC')
  @ApiOperation({ summary: 'Get all employees' })
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Companies Data.',
      data: [],
    },
  })
  findAll(@Query(JoiPipe) query: FindAllEmployeesDto) {
    return this.employee.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Company Data.',
      data: {},
    },
  })
  @ApiNotFoundResponse({
    example: {
      statusCode: 404,
      message: 'No data found.',
      data: null,
    },
  })
  findOne(@Param('id') id: string) {
    return this.employee.findOne(id);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Company created successfully.' })
  create(@Body() dto: CreateEmployeeDto) {
    return this.employee.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a employee' })
  update(@Param('id') id: string, @Body() dto: CreateEmployeeDto) {
    return this.employee.update(id, dto);
  }

  @Delete('/remove/:id')
  @ApiOperation({ summary: 'Delete a employee' })
  delete(@Param('id') id: string) {
    return this.employee.delete(id);
  }
}
