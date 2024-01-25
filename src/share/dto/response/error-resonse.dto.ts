import { ApiProperty } from '@nestjs/swagger';

export class BaseErrorResponse {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  statusCode: string;

  @ApiProperty()
  metadata: Record<string, any>;
}

export class ErrorResponse extends BaseErrorResponse {
  constructor(message: string, statusCode: number, metadata: object = {}) {
    super();

    this.message = message;
    this.statusCode = String(statusCode);
    this.metadata = metadata;
  }
}
