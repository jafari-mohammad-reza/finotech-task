import { SeedModule } from './seed-module';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { UserSeedService } from './user/user-seed.service';
import { ProductSeedService } from './product/product-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);
  const dataSource = app.get(DataSource);
  await dataSource.synchronize();
  await app.get(UserSeedService).run();
  await app.get(ProductSeedService).run();
  await app.close();
};

void runSeed();
