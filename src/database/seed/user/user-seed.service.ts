import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcryptjs';
import { User } from 'src/modules/user/repository';
import { Repository } from 'typeorm';

const seedUsers = [
  { email: 'admin@gmail.com', password: 'Admin123' },
  { email: 'user@gmail.com', password: 'User123' },
];
@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  async run() {
    for (const user of seedUsers) {
      const { email, password } = user;
      const userExist = await this.repo.findOne({ where: { email } });
      if (!userExist) {
        const salt = await genSalt(
          this.configService.get('app.hashSaltRounds'),
        );
        const hashedPassword = await hash(password, salt);
        await this.repo.save({
          email,
          password: hashedPassword,
          isVerified: true,
        });
      }
    }
  }
}
