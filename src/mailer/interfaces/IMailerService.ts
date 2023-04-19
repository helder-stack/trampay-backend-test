import { Transporter } from "nodemailer";
import CreateEmailDTO from "../DTOs/CreateEmail.dto";
import Email from "../models/Email.model";
import User from "src/user/models/User.model";
import PasswordToken from "src/password-tokens/Models/PasswordToken.model";

export default interface IMailerService {

    sendMail(data: CreateEmailDTO): Promise<void>;
    createTransporter(): Promise<Transporter>
    mount(data: CreateEmailDTO): Email;
    sendMailToResetPassword(user: User, passwordToken: PasswordToken): Promise<void>
}