import PasswordToken from "../Models/PasswordToken.model";

export default interface IPasswordTokensService {
    createNewToken(userId: number);
    mount(userId: number): Promise<PasswordToken>
    generateToken(): Promise<string>;
    findByToken(token: string): Promise<PasswordToken>
    invalidateToken(id: string): Promise<null>
}