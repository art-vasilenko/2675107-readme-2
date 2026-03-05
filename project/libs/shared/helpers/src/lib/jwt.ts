import { User, TokenPayload } from '@project/shared/app/types';

export function createJWTPayload(user: User): TokenPayload {
  if (!user.id) {
    throw new Error('Cannot create JWT: user id is missing');
  }

  return {
    sub: user.id,
    email: user.email,
    name: user.name,
  };
}
