import { Types } from 'mongoose';
import { HttpError } from '../errors/httpError';

export function assertObjectId(value: string, name: string) {
  if (!Types.ObjectId.isValid(value)) {
    throw new HttpError(400, `Invalid ${name}`);
  }
}
