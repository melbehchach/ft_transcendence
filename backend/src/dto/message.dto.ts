import { IsNotEmpty, IsString } from 'class-validator';

export class messageDto {
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;
  //   channelId: string;
  //   chatId: string;
}
