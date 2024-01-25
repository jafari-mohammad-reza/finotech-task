import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProduct {
  @ApiProperty({ type: String, name: 'title', required: true })
  @IsString()
  title: string;
  @ApiProperty({ type: String, name: 'description', required: true })
  @IsString()
  description: string;
}

export class UpdateProduct extends PartialType(CreateProduct) {}
