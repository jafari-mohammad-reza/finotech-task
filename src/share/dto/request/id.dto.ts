import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class TokenIdDto {
  @ApiProperty({ type: String, required: true, name: 'token' })
  @IsUUID()
  @IsNotEmpty()
  token: string;
}
export class IdDto {
  @ApiProperty({ type: Number, required: true, name: 'id' })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
