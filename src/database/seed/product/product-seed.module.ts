import { Module } from '@nestjs/common';
import { ProductSeedService } from './product-seed.service';

@Module({
  imports: [],
  providers: [ProductSeedService],
  exports: [ProductSeedService],
})
export class ProductSeedModule {}
