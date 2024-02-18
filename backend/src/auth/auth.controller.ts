import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signinDTO, signupDTO } from 'src/dto';
import { FTAuthGuard } from 'src/guards/auth.42.guard';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/guards/auth.jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FTAuthGuard)
  @Get('42')
  auth42() {}

  @UseGuards(FTAuthGuard)
  @Get('42-redirect')
  async auth42Redirect(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.redirect(req, res);
  }

  @Get('preAuthData')
  async getPreAuthData(@Req() req) {
    return this.authService.preAuth(req);
  }

  @Post('finish_signup')
  async finish_signup(
    @Body() dto: signupDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const UserToken = req.cookies['USER'];
    if (!UserToken) {
      return new UnauthorizedException({ Forbidden: 'invalid USER token' });
    }
    const { id, accessToken } = await this.authService.finish_signup(
      dto,
      UserToken,
    );
    res.cookie('JWT_TOKEN', accessToken);
    res.cookie('USER_ID', id);
    return { msg: 'Success' };
  }

  // @UseGuards(AuthGuard)
  @Post('uploadAvatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}_${file.originalname}`);
        },
      }),
    }),
  )
  async uploadAvatar(
    @Req() req,
    @UploadedFile() file,
    @Res({ passthrough: true }) res,
  ) {
    const UserToken = req.cookies['USER'];
    this.authService.saveAvatar(UserToken, file);
    res.cookie('USER', '', { expires: new Date() });
    return { msg: 'success' };
  }

  @HttpCode(200)
  @Post('signin')
  async signin(
    @Body() dto: signinDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const TFA: boolean = await this.authService.signin(dto, res);
    if (TFA) {
      res.cookie('JWT_TOKEN', '', { expires: new Date() });
    }
    return { TFA };
  }

  @UseGuards(AuthGuard)
  @Get('signout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('JWT_TOKEN', '', { expires: new Date() });
    res.cookie('USER_ID', '', { expires: new Date() });
    return { msg: 'Success' };
  }

  @UseGuards(AuthGuard)
  @Get('tfa/check')
  async checkTFA(@Req() req) {
    return this.authService.TFAisEnabled(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('tfa/secret')
  async getSecret(@Req() req) {
    return this.authService.TFAgetSecret(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('tfa/enable')
  async TFAenable(@Req() req) {
    if (!req.body.token) {
      throw new BadRequestException({ error: 'Token missing' });
    }
    return this.authService.TFAenable(req.user.id, req.body.token);
  }

  @UseGuards(AuthGuard)
  @Patch('tfa/disable')
  async TFAdisable(@Req() req) {
    return this.authService.TFAdisable(req.user.id);
  }

  // @UseGuards(AuthGuard)
  @Post('tfa/verify')
  async TFAverify(@Req() req, @Res({ passthrough: true }) res) {
    if (!req.body.token) {
      throw new BadRequestException({ error: 'Token missing' });
    }
    const id = req.cookies['USER_ID'];
    if (!id) {
      throw new BadRequestException({
        error: 'Something went wrong. Try again',
      });
    }
    const valid = await this.authService.TFAverifyCode(id, req.body.token);
    if (valid) {
      const { accessToken } = await this.authService.signToken(id);
      res.cookie('JWT_TOKEN', accessToken);
    }
    return { valid };
  }
}
