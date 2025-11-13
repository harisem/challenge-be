import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

export class LoginDto {
  @ApiProperty({ example: 'username' })
  @JoiSchema(Joi.string().required())
  username: string;

  @ApiProperty({ example: 'PasswordNiBos123!' })
  @JoiSchema(Joi.string().required())
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'username' })
  @JoiSchema(Joi.string().required())
  username: string;

  @ApiProperty({ example: 'user@company.id' })
  @JoiSchema(Joi.string().email().required())
  email: string;

  @ApiProperty({ example: 'Fahar Arsifa' })
  @JoiSchema(Joi.string().required())
  name: string;

  @ApiProperty({ example: '812' })
  @JoiSchema(Joi.string().required())
  phone: string;

  @ApiProperty({ example: '812' })
  @JoiSchema(Joi.string().required())
  address: string;

  @ApiProperty({ example: '9a4f2eae-b6a5-4a67-bd8f-9c35bdf83fcd' })
  @JoiSchema(Joi.string().required())
  city_id: string;

  @ApiProperty({ example: '9a4f2eae-b6a5-4a67-bd8f-9c35bdf83fcd' })
  @JoiSchema(Joi.string().required())
  province_id: string;

  @ApiProperty({ example: '9a4f2eae-b6a5-4a67-bd8f-9c35bdf83fcd' })
  @JoiSchema(Joi.string().required())
  country_id: string;

  @ApiProperty({ example: 'PasswordNiBos123!' })
  @JoiSchema(Joi.string().required())
  password: string;

  @ApiProperty({ example: 'PasswordNiBos123!' })
  @JoiSchema(Joi.string().required())
  confirmPassword: string;

  @ApiProperty({ example: "['9a4f2eae-b6a5-4a67-bd8f-9c35bdf83fcd']" })
  @JoiSchema(Joi.array().required())
  company_id: string[];

  @ApiProperty({ example: "['9a4f2eae-b6a5-4a67-bd8f-9c35bdf83fcd']" })
  @JoiSchema(Joi.array().required())
  position_id: string[];
}
