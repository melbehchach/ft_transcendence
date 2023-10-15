import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../guards/auth.jwt.guard';
import { FTStrategy } from './42.strategy';
import { FTAuthGuard } from '../guards/auth.42.guard';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    PassportModule.register({ session: false }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, FTAuthGuard, FTStrategy],
})
export class AuthModule {}
