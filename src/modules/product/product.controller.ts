import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationResponse } from '../../share/dto/paginated-response.dto';
import { ProductResponse } from './dto/product-response';
import { IdDto } from 'src/share/dto/id.dto';

@Controller({
  path: 'product',
  version: '1',
})
export class ProductController {
  constructor(private readonly authService: ProductService) {}
  @Get('owned-products')
  async getOwnedProducts(): Promise<PaginationResponse<ProductResponse[]>> {
    return;
  }
  @Get('')
  async getProducts(): Promise<PaginationResponse<ProductResponse[]>> {
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
