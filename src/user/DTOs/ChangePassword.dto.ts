import { IsDefined } from "class-validator";

export default class ChangePasswordDTO{

    @IsDefined()
    token: string;
    @IsDefined()
    newPassword: string;
}