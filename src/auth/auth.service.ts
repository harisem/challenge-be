import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/auth.dto';
// import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid: boolean = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const result = { ...user };
    return result;
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid username or password');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid email or password');

    const jwtOptions: JwtSignOptions = {
      expiresIn: '3h',
    };

    const payload = {
      id: user.id,
      username,
      role: user,
    };

    const token = this.jwt.sign(payload, jwtOptions);

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_at: jwtOptions.expiresIn,
      id: user.id,
      user: {
        username,
      },
      roles: '',
      companies: '',
    };
  }

  // async register(data: { email: string; password: string; role?: string }) {
  //   const hashed = await bcrypt.hash(data.password, 10);
  //   const roleEnum = (data.role?.toUpperCase() as Role) ?? Role.BASIC;
  //   return this.prisma.user.create({
  //     data: { email: data.email, password: hashed, role: roleEnum },
  //   });
  // }

  async register(data: RegisterDto) {
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
      if (data.password == data.confirmPassword) {
        const userCompanyArray = data.company_id.map((m, i) => {
          return {
            company_id: m,
            position_id: data.position_id[i],
          };
        });

        const hashed = await bcrypt.hash(data.password, 10);
        const reg = await this.prisma.user.create({
          data: {
            name: data.name,
            username: data.username,
            password: hashed,
            email: data.email,
            address: data.address,
            phone: data.phone,
            created_by: data.username,
            country: {
              connect: { id: data.country_id },
            },
            province: {
              connect: { id: data.province_id },
            },
            city: {
              connect: { id: data.city_id },
            },
            employee: {
              create: { name: data.name, code: '', created_by: data.username },
            },
            user_company: {
              createMany: {
                data: userCompanyArray,
              },
            },
          },
        });

        if (Object.keys(reg).length < 1) {
          response.status = HttpStatus.BAD_REQUEST;
          response.message = 'Failed to store.';
          response.data = null;
        } else {
          response.status = HttpStatus.CREATED;
          response.message = 'User created successfully';
          response.data = reg;
        }
      } else {
        response.status = HttpStatus.BAD_REQUEST;
        response.message = "Password confirmation doesn't match";
        response.data = null;
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
