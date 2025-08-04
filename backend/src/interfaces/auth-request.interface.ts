import { Request } from 'express';
import { Payload } from 'src/interfaces/payload';

export interface AuthRequest extends Request {
  user: Payload;
}
