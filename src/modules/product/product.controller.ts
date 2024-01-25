import {
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
import { ProductResponse } from './dto/product-response';

import { ApiTags } from '@nestjs/swagger';
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
    const result = await this.productService.ownedProducts(userId, page, count);
    return new PaginationResponse(result, result.length, page, count);
  }
  @Get('')
  async getProducts(
    @Query() dto: PaginatedRequest,
  ): Promise<PaginationResponse<ProductResponse[]>> {
    const { page, count } = dto;
    return;
  }
  @Post()
  async createProduct(): Promise<ProductResponse> {
    return;
  }
  @Patch('/:id')
  async updateProduct(@Param() { id }: IdDto): Promise<void> {
    return;
  }
  @Delete('/:id')
  async deleteProduct(@Param() { id }: IdDto): Promise<void> {
    return;
  }
}
