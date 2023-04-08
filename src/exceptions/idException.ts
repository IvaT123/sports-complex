import { HttpException, HttpStatus } from '@nestjs/common';

export const idException = new HttpException(
  'Entity with given id does not exist',
  HttpStatus.NOT_FOUND,
);
