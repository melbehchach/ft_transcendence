import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserGuard } from 'src/guards/user.jwt.guard';
// import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  // imports: [
  // JwtModule.register({
  // global: true,
  // secret: process.env.JWT_SECRET,
  // }),
  // ],
  controllers: [UserController],
  providers: [UserService, UserGuard, AuthService],
})
export class UserModule {}
