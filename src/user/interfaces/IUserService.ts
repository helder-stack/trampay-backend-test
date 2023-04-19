import PasswordToken from "src/password-tokens/Models/PasswordToken.model";
import AuthUserDTO from "../DTOs/AuthUser.dto"
import UserDTO from "../DTOs/User.dto"
import User from "../models/User.model";
import ChangePasswordDTO from "../DTOs/ChangePassword.dto";

export default interface IUserService {

    create(data: UserDTO): Promise<User>
    mountAntValidateUser(data: UserDTO): Promise<UserDTO>
    mount(data: UserDTO): Promise<UserDTO>;
    encryptPassword(password: string): Promise<string>
    auth(data: AuthUserDTO): Promise<any>
    findAndValidateUserData(data: AuthUserDTO): Promise<User>
    findByEmail(email: string): Promise<User>
    generateJWT(user: User): Promise<string | undefined>
    recoverPass(email: string)
    validatePasswordToken(email): Promise<null>
    updatePassword(data: ChangePasswordDTO): Promise<null>
}