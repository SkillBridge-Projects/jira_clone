import jwt, { SignOptions } from 'jsonwebtoken';
import { isPlainObject } from 'lodash';

import { InvalidTokenError } from 'errors';

export const signToken = (payload: object, options?: SignOptions, min?: number): string =>
  {
    const expiryTime = min || '180 days'
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expiryTime,
      ...options,
    });
  }

export const verifyToken = (token: string): { [key: string]: any } => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (isPlainObject(payload)) {
      return payload as { [key: string]: any };
    }
    throw new Error();
  } catch (error) {
    throw new InvalidTokenError();
  }
};
