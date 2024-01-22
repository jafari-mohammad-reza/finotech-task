import { PickType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class EmailDto extends PickType(RegisterDto, ['email']) {}
