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
}
