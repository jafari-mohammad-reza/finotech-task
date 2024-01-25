import { PostgresRepository } from '../../../database/postgres.repository';
import { Product } from './product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
@Injectable()
export class ProductRepository extends PostgresRepository<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly _repository: Repository<Product>,
  ) {
    super(_repository);
  }
  async findPaginatedProducts(
    page: number,
    limit: number,
    userId?: number,
  ): Promise<[Product[], number]> {
    const skip = (page - 1) * limit;
    const queryOptions: FindManyOptions<Product> = {
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: skip,
      relations: ['creator'],
    };
    if (userId !== undefined) {
      queryOptions.where = { creator: { id: userId } };
    }
    return await this._repository.findAndCount(queryOptions);
  }
  async createProduct(
    userId: number,
    title: string,
    description: string,
  ): Promise<Product> {
    return await this.save({
      title,
      description,
      creator: {
        id: userId,
      },
    });
  }
}
