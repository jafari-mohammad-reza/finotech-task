import { Module } from '@nestjs/common';
import { UserSeedService } from './user-seed.service';

@Module({
  imports: [],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
