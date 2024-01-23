import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ type: String, name: 'firstName', required: true })
  @IsString()
  firstName: string;
  @ApiProperty({ type: String, name: 'lastName', required: true })
  @IsString()
  lastName: string;
  @ApiProperty({ type: String, name: 'email', required: true })
  @IsEmail()
  email: string;
  @ApiProperty({ type: String, name: 'password', required: true })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/)
  password: string;
}
