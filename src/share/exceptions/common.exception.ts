import {
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ResponseMessages } from '../enums';

export class UpdateFailed extends ServiceUnavailableException {
  constructor() {
    super(ResponseMessages.UPDATE_FAILED);
  }
}

export class DeleteFailed extends ServiceUnavailableException {
  constructor() {
    super(ResponseMessages.DELETE_FAILED);
  }
}

export class InternalServerError extends InternalServerErrorException {
  constructor() {
    super(ResponseMessages.INTERNAL_SERVER_ERROR);
  }
}
