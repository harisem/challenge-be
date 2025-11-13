import {
  Body,
  Controller,
  Delete,
  Get,
  // Header,
  Param,
  Patch,
  Post,
  Query,
  Req,
  // StreamableFile,
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
import { CompanyService } from './company.service';
// import { Roles } from '../common/roles.decorator';
// import { RolesGuard } from '../common/roles.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateCompanyDto, FindAllCompaniesDto } from './dto/company.dto';
import { JoiPipe } from 'nestjs-joi';
// import * as ExcelJS from 'exceljs';
// import { Readable } from 'stream';
// import { Company } from '@prisma/client';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompanyController {
  constructor(private company: CompanyService) {}

  @Get('/findCompany')
  // @Roles('ADMIN', 'MANAGER', 'BASIC')
  @ApiOperation({ summary: 'Get all companies' })
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Companies Data.',
      data: [],
    },
  })
  findAll(@Query(JoiPipe) query: FindAllCompaniesDto) {
    return this.company.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
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
    return this.company.findOne(id);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully.' })
  create(@Body() dto: CreateCompanyDto) {
    return this.company.create(dto);
  }

  @Patch('/update/:id')
  @ApiOperation({ summary: 'Update a company' })
  update(@Param('id') id: string, @Body() dto: CreateCompanyDto) {
    return this.company.update(id, dto);
  }

  @Delete('/remove/:id')
  @ApiOperation({ summary: 'Delete a company' })
  delete(@Param('id') id: string, @Req() req: Request) {
    const data = (req as any)?.user.role ?? '';
    return this.company.delete(id, data);
  }

  // @Get('export')
  // @Header(
  //   'Content-Type',
  //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // )
  // @Header('Content-Disposition', 'attachment; filename=companies.xlsx')
  // async exportCompanies(): Promise<StreamableFile | object> {
  //   const result = await this.company.findAll();

  //   if (!result.data || result.data.length < 1) {
  //     return result;
  //   }

  //   const workbook = new ExcelJS.Workbook();

  //   const sheet2 = workbook.addWorksheet('All Companies');
  //   sheet2.addRow(['Company Name']);
  //   result.data.forEach((c: Company) => sheet2.addRow([c.name]));

  //   const dataLength = result.data.length;

  //   const sheet1 = workbook.addWorksheet('Selected Companies');
  //   sheet1.addRow(['Company Name', 'Add Another Company']);
  //   const firstTen = result.data.slice(0, 10);
  //   firstTen.forEach((c: Company) => {
  //     const row = sheet1.addRow([c.name, '']);
  //     row.getCell(2).dataValidation = {
  //       type: 'list',
  //       allowBlank: true,
  //       formulae: [`'All Companies'!$A$2:$A$${dataLength + 1}`],
  //       showErrorMessage: true,
  //       errorTitle: 'Invalid company',
  //       error: 'Please select a company from the list',
  //     };
  //   });

  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const stream = Readable.from([buffer]);

  //   return new StreamableFile(stream, {
  //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     disposition: 'attachment; filename="companies.xlsx"',
  //   });
  // }
}
