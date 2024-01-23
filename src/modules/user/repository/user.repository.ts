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
  async findByEmail(email: string): Promise<User> {
    return await this._repository.findOne({ where: { email } });
  }
  async verifyUser(user: User): Promise<number> {
    const { affected } = await this._repository.update(user.id, {
      isVerified: true,
    });
    return affected;
  }
}
