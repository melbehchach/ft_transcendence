import { ChannelType, User } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class newChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  //   image: Express.Multer.File;
  image: string;

  @IsNotEmpty()
  type: ChannelType;

  @IsString()
  password: string;

  Members: User[];
}

export class updateChannelDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  type: ChannelType | null;

  @IsString()
  password: string;

  Members: User[]; //all or just the changes
}
