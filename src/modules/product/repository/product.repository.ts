import { PostgresRepository } from '../../../database/postgres.repository';
import { Product } from './product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ProductRepository extends PostgresRepository<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly _repository: Repository<Product>,
  ) {
    super(_repository);
  }
  async findUserProducts(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Product[]> {
    const skip = (page - 1) * limit;
    try {
      const products = await this._repository
        .createQueryBuilder('product')
        .select([
          'product.title',
          'product.description',
          'creator.email as owner',
        ])
        .innerJoin('product.creator', 'creator')
        .where('creator.id = :userId', { userId })
        .orderBy('product.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      return products;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
