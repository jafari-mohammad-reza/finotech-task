import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty({ type: Object })
  response: T;

  @ApiProperty({ type: Object })
  metadata: object;

  @ApiProperty({ type: String, required: false })
  message?: string;

  @ApiProperty({ type: Number })
  statusCode: number;

  constructor(
    response: T,
    metadata = null,
    message?: string,
    statusCode = 200,
  ) {
    this.response = response;
    this.message = message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
}
