import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { Product } from './repository/product.entity';
import { ProductResponse } from './dto/product-response';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
  async ownedProducts(
    userId: number,
    page: number,
    count: number,
  ): Promise<ProductResponse[]> {
    return (
      await this.productRepository.findUserProducts(userId, page, count)
    ).map((item) => ({
      title: item.title,
      description: item.description,
      owner: item.creator.email,
    }));
  }
}
