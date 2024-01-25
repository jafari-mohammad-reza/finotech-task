import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SuccessResponse } from './success-response.dto';
import { HttpStatus } from '@nestjs/common';

class PaginationData {
  @ApiProperty()
  itemsCount: number;

  @ApiPropertyOptional()
  nextPage?: number;

  @ApiPropertyOptional()
  previousPage?: number;

  @ApiProperty({ default: 0 })
  pagesCount: number;

  @ApiProperty()
  pageSize: number;
}

export class PaginationResponse<type> extends SuccessResponse<type> {
  @ApiProperty()
  pagination: PaginationData;

  constructor(
    data: type,
    itemsCount: number,
    currentPage: number,
    limit: number,
    message?: string,
    metadata: object = {},
  ) {
    super(data, metadata, message, HttpStatus.OK);

    const pagesCount = Math.ceil(itemsCount / limit) || 1;
    this.pagination = {
      itemsCount,
      pageSize: limit,
      nextPage:
        currentPage === pagesCount || itemsCount === 0 ? null : currentPage + 1,
      previousPage:
        currentPage === 1 || itemsCount === 0 ? null : currentPage - 1,
      pagesCount: itemsCount === 0 ? 0 : pagesCount,
    };
  }
}
