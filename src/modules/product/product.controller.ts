import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationResponse } from '../../share/dto/paginated-response.dto';
import { ProductResponse } from './dto/product-response';
import { IdDto } from 'src/share/dto/id.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthGuard,
  AuthenticatedUser,
  AuthenticatedUserInterceptor,
} from 'src/share';

@Controller({
  path: 'product',
  version: '1',
})
@ApiTags('Product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly authService: ProductService) {}
  @Get('owned-products')
  @UseInterceptors(AuthenticatedUserInterceptor)
  async getOwnedProducts(
    @AuthenticatedUser() userId: number,
  ): Promise<PaginationResponse<ProductResponse[]>> {
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
