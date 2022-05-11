import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseHttpType } from 'src/constants';
import { ValidationPipe } from 'src/utils/validation/validation.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('store')
  async store(
    @Res() res: Response,
    @Body(new ValidationPipe()) createRoleDto: CreateRoleDto,
  ) {
    try {
      const data: ResponseHttpType = await this.roleService.create(
        createRoleDto,
      );
      return res.status(HttpStatus.OK).json({ ...data });
    } catch (error) {
      throw new HttpException(
        'Internal Server Error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async update(
    @Res() res: Response,
    @Body() updateRoleDto: UpdateRoleDto,
    @Param('id') id: number,
  ) {
    try {
      const data: ResponseHttpType = await this.roleService.updateRole(
        id,
        updateRoleDto,
      );
      return res.status(HttpStatus.OK).json({ ...data });
    } catch (error) {
      throw new HttpException(
        'Internal Server Error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('detail/:id')
  detail() {}

  @Get('list')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data: ResponseHttpType = await this.roleService.list({
        ...req.query,
        page,
        limit,
      });
      return res.status(HttpStatus.OK).json({ ...data });
    } catch (error) {
      throw new HttpException(
        'Internal Server Error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
