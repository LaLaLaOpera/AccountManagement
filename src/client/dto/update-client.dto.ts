import { IsEmail, IsJSON, IsOptional, IsString } from 'class-validator';
import {} from 'class-transformer';

export class UpdateClientDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  accessKey: string;

  @IsOptional()
  @IsJSON()
  setting: object;
}
