import { UnauthorizedException } from '@nestjs/common';

export async function validateToken(token, jwt) {
  if (!token) throw new UnauthorizedException('No Token Found');
  try {
    const payload = await jwt.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    return payload;
  } catch {
    throw new UnauthorizedException();
  }
}
