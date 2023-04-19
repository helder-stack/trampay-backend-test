import { Injectable } from "@nestjs/common";
import IMailerService from "./interfaces/IMailerService";
import { createTransport, createTestAccount, Transporter } from 'nodemailer'
import CreateEmailDTO from "./DTOs/CreateEmail.dto";
import Email from "./models/Email.model";
import User from "src/user/models/User.model";
import PasswordToken from "src/password-tokens/Models/PasswordToken.model";

@Injectable()
export default class MailerService implements IMailerService {

    async sendMail(data: Email): Promise<void> {
        const transporter = await this.createTransporter()
        await transporter.sendMail(data).catch(e => {
            console.error(e)
        })
    }

    async createTransporter(): Promise<Transporter> {
        const transporter = await createTransport({
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            secure: false,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            }
        })
        return transporter
    }

    mount(data: CreateEmailDTO): Email {
        const email = new Email()
        email.from = data.from
        email.subject = data.subject
        email.text = data.text
        email.to = data.to
        email.html = data.html
        return email
    }

    async sendMailToResetPassword(user: User, passwordToken: PasswordToken): Promise<void> {
        const date = new Date(passwordToken.expiresAt)
        const template = `<p>Olá, ${user.name} ${user?.lastName || ''}!</p><p>Acesse www.example.com e insira o token <strong>${passwordToken.token}</strong> para alterar a sua senha!</p>\n\n<p>Vale lembrar que este token estará disponível até <strong>${date.toLocaleDateString()}</strong></p>`
        const data: CreateEmailDTO = {
            from: "Trampay test",
            to: user.email,
            subject: "Recuperar senha",
            text: '',
            html: template
        }
        const mountedRecoverPassword = await this.mount(data)
        await this.sendMail(mountedRecoverPassword)
    }

}