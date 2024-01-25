import { Module } from '@nestjs/common';
import { ProductSeedService } from './product-seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/repository';
import { Product } from 'src/modules/product/repository/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  providers: [ProductSeedService],
  exports: [ProductSeedService],
})
export class ProductSeedModule {}
