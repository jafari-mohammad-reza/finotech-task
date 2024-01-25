import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class TokenIdDto {
  @ApiProperty({ type: String, required: true, name: 'token' })
  @IsUUID()
  @IsNotEmpty()
  token: string;
}
export class IdDto {
  @ApiProperty({ required: true, name: 'id' })
  @IsString()
  @IsNotEmpty()
  id: number;
}
