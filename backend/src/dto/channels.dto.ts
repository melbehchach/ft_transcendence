import { ChannelType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class newChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // avatar: Express.Multer.File;

  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @IsString()
  password: string;

  Members: string[]; // Array of ids
}

export class makeAdminDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  makeAdmin: boolean;
}

export class editTypeDto {
  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @IsString()
  password: string;
}
