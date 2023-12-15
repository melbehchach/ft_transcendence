import { ChannelType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class newChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  //   image: Express.Multer.File;
  image: string;

  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @IsString()
  password: string;

  Members: string[]; // Array of ids
}

// export class updateChannelDto {
//   @IsString()
//   name: string;

//   @IsString()
//   image: string;

//   type: ChannelType | null;

//   @IsString()
//   password: string;

//   Members: string[]; // Array of ids
// }

export class makeAdminDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  makeAdmin: boolean;
}

// export class BanUserDto {
//   @IsString()
//   @IsNotEmpty()
//   id: string;

//   @IsBoolean()
//   @IsNotEmpty()
//   ban: boolean;
// }

export class editTypeDto {
  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @IsString()
  password: string;
}
