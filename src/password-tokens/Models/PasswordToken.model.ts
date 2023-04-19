export default class PasswordToken{
    id?: number
    userId: number;
    token: string;
    isValidated: boolean
    expiresAt: Date
}