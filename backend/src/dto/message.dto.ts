import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelMessageDto {
  senderId: string;

  @IsString()
  @IsNotEmpty()
  channelName: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}

export class DirectMessageDto {
  senderId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
