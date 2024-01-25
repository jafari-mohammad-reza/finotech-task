import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/product/repository/product.entity';
import { User } from 'src/modules/user/repository';
import { Repository } from 'typeorm';

const seedProducts = [
  {
    title: 'FirstProduct',
    description: '',
    creator: 'admin@gmail.com',
  },
  {
    title: 'SecondProduct',
    description: '',
    creator: 'admin@gmail.com',
  },
  {
    title: 'ThirdProduct',
    description: '',
    creator: 'admin@gmail.com',
  },
  {
    title: 'ForthProduct',
    description: '',
    creator: 'user@gmail.com',
  },
  {
    title: 'FifthProduct',
    description: '',
    creator: 'user@gmail.com',
  },
  {
    title: 'SixthProduct',
    description: '',
    creator: 'user@gmail.com',
  },
];

@Injectable()
export class ProductSeedService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async run() {
    for (const product of seedProducts) {
      const { creator, description, title } = product;
      const existProduct = await this.productRepository.findOne({
        where: { title },
      });
      if (!existProduct) {
        const user = await this.userRepository.findOne({
          where: { email: creator },
        });
        if (!user) {
          throw new NotFoundException(`Seed user not found ${creator}`);
        }
        await this.productRepository.save({
          title,
          description,
          creator: user,
        });
      }
    }
  }
}
