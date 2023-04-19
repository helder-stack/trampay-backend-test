import { IsDefined, IsEmail, IsString, Length } from "class-validator";

export default class AuthUserDTO{
    @IsDefined()
    @IsEmail()
    @IsString()
    email: string;
    @IsDefined()
    @IsString()
    @Length(6)
    password: string;
}