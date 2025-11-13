import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import Joi from 'joi';

export class EmployeeDto {
  @ApiProperty({ example: '9a4f2eae-b6a5-4a67-bd8f-9c35bdf83fcd' })
  id: string;

  @ApiProperty({ example: 'Fahar Muh' })
  name: string;

  @ApiProperty({ example: '123 Business Street, Jakarta' })
  address?: string;

  @ApiProperty({ example: '2025-11-10T14:33:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-11-10T14:33:00.000Z' })
  updatedAt: Date;
}

export class CreateEmployeeDto {
  @ApiProperty({ example: 'FHR01' })
  @JoiSchema(Joi.string().min(3).max(5).required())
  code: string;

  @ApiProperty({ example: 'Fahar Corp.' })
  @JoiSchema(Joi.string().min(2).max(100).required())
  name: string;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @JoiSchema(Joi.string().uuid().optional())
  id?: string;
}

export class FindAllEmployeesDto {
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
