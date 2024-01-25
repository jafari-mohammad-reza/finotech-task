import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginatedRequest {
  @ApiProperty({ type: Number, required: false, default: 1, name: 'page' })
  @IsOptional()
  page: number;
  @ApiProperty({ type: Number, required: false, default: 10, name: 'count' })
  @IsOptional()
  count: number;
}
