import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Min, Matches, Max } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ type: String, name: 'firstName', required: true })
  @IsString()
  firstName: true;
  @ApiProperty({ type: String, name: 'lastName', required: true })
  @IsString()
  lastName: true;
  @ApiProperty({ type: String, name: 'email', required: true })
  @IsEmail()
  email: true;
  @ApiProperty({ type: String, name: 'password', required: true })
  @IsString()
  @Min(8)
  @Max(16)
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/)
  password: true;
}
