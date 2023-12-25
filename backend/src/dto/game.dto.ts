import { IsNotEmpty, IsString } from 'class-validator';

export class GameRequestDTO {
  @IsNotEmpty()
  @IsString()
  id : string
}
