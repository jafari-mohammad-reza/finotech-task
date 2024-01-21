import { Injectable } from '@nestjs/common';
import { PostgresRepository } from '../../../database/postgres.repository';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends PostgresRepository<User> {
  constructor(
    @InjectRepository(User) private readonly _repository: Repository<User>,
  ) {
    super(_repository);
  }
}
