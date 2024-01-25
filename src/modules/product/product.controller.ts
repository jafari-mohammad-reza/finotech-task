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
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationResponse } from '../../share/dto/response/paginated-response.dto';
import { ProductResponse, CreateProduct, UpdateProduct } from './dto';

import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ServiceUnavailableException } from '@nestjs/common';
import {
  AuthGuard,
  AuthenticatedUser,
  AuthenticatedUserInterceptor,
  IdDto,
  PaginatedRequest,
} from 'src/share';

@Controller({
  path: 'product',
  version: '1',
})
@ApiTags('Product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('owned-products')
  @UseInterceptors(AuthenticatedUserInterceptor)
  async getOwnedProducts(
    @AuthenticatedUser() userId: number,
    @Query() dto: PaginatedRequest,
  ): Promise<PaginationResponse<ProductResponse[]>> {
    const { page, count } = dto;
    const [result, resultCount] =
      await this.productService.getPaginatedProducts(userId, page, count);
    return new PaginationResponse(result, resultCount, page, count);
  }
  @Get()
  async getProducts(
    @Query() dto: PaginatedRequest,
  ): Promise<PaginationResponse<ProductResponse[]>> {
    const { page, count } = dto;
    const [result, resultCount] =
      await this.productService.getPaginatedProducts(page, count);
    return new PaginationResponse(result, resultCount, page, count);
  }
  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  async createProduct(
    @AuthenticatedUser() userId: number,
    @Body() dto: CreateProduct,
  ): Promise<ProductResponse> {
    return await this.productService.createProduct(userId, dto);
  }
  @Patch('/:id')
  @ApiConsumes('application/x-www-form-urlencoded')
  async updateProduct(
    @Param() { id }: IdDto,
    @Body() dto: UpdateProduct,
  ): Promise<void> {
    await this.productService.updateProduct(id, dto);
  }
  @Delete('/:id')
  async deleteProduct(@Param() { id }: IdDto): Promise<void> {
    await this.productService.deleteProduct(id);
  }
}
