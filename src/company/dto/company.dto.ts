import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import Joi from 'joi';
// import { IsNotEmpty, IsString } from 'class-validator';

export class CompanyDto {
  @ApiProperty({ example: '9a4f2eae-b6a5-4a67-bd8f-9c35bdf83fcd' })
  id: string;

  @ApiProperty({ example: 'Fahar Corp.' })
  name: string;

  @ApiProperty({ example: '123 Business Street, Jakarta' })
  address?: string;

  @ApiProperty({ example: '2025-11-10T14:33:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-11-10T14:33:00.000Z' })
  updatedAt: Date;
}

export class CreateCompanyDto {
  @ApiProperty({ example: 'FHR001' })
  @JoiSchema(Joi.string().min(2).max(100).required())
  code: string;

  @ApiProperty({ example: 'Fahar Corp.' })
  @JoiSchema(Joi.string().min(2).max(100).required())
  name: string;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @JoiSchema(Joi.string().uuid().optional())
  id?: string;
}

export class FindAllCompaniesDto {
  @ApiPropertyOptional()
  @JoiSchema(Joi.string().default(' '))
  search: string;

  @ApiPropertyOptional()
  @JoiSchema(Joi.number())
  page: number = 1;

  @ApiPropertyOptional()
  @JoiSchema(Joi.number())
  limit: number = 20;
}
