import { IsEmail, IsString, MinLength } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @MinLength(1)
  ticketTypeId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  name!: string;
}
