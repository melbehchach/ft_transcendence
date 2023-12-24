import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
// import { Transform } from 'class-transformer';

export enum SearchType {
  ALL = 'ALL',
  USERS = 'USERS',
  CHANNELS = 'CHANNELS',
}

export class searchDto {
  @IsString()
  @IsNotEmpty()
  //   @Transform(({ value }) => value.toLowerCase())
  query: string;

  @IsNotEmpty()
  @IsEnum(SearchType)
  type: SearchType;
}
