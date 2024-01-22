import { PickType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class LoginDto extends PickType(RegisterDto, ['email', 'password']) {}
