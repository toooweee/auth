import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { IsPasswordsMatchingConstraint } from '@common/decorators';

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstraint)
    passwordRepeat: string;
}
