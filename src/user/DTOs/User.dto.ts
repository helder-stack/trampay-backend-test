import { IsDefined, IsOptional, IsString, Length } from "class-validator";


export default class UserDTO{

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsDefined()
    @IsString()
    email: string;

    @IsDefined()
    @IsString()
    @Length(6)
    password: string;

}