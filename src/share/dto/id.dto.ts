import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdDto {
  @ApiProperty({ type: String, required: true, name: 'token' })
  @IsUUID()
  @IsNotEmpty()
  token: string;
}
