import { HttpException, Injectable } from "@nestjs/common";
import IUserService from "./interfaces/IUserService";
import UserDTO from "./DTOs/User.dto";
import AuthUserDTO from "./DTOs/AuthUser.dto";
import { PrismaService } from "src/prisma.service";
import { validate } from "class-validator";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import User from "./models/User.model";
import MailerService from "src/mailer/Mailer.service";
import PasswordTokensService from "src/password-tokens/Password-tokens.service";
import { NotFoundError } from "rxjs";
import PasswordToken from "src/password-tokens/Models/PasswordToken.model";
import ChangePasswordDTO from "./DTOs/ChangePassword.dto";

@Injectable()
export default class UserService implements IUserService {
    constructor(
        private prisma: PrismaService,
        private mailerService: MailerService,
        private passwordTokensService: PasswordTokensService
    ) { }

    async create(data: UserDTO): Promise<User> {
        const user = await this.mountAntValidateUser(data)
        user.password = await this.encryptPassword(user.password)
        if (user) {
            try {
                const createdUser = await this.prisma.user.create({
                    data: user
                })
                return createdUser
            } catch (e) {
                throw new HttpException(e?.message, 500)
            }
        }
    }

    async mountAntValidateUser(data: UserDTO): Promise<UserDTO> {
        const user = this.mount(data)
        const [validationError] = await validate(user)
        const findUser = await this.prisma.user.findFirst({
            where: {
                email: data.email
            }
        })
        if (validationError) {
            throw new HttpException(validationError.constraints, 400)
        } else if (findUser) {
            throw new HttpException("This e-mail is already used.", 400)
        }
        return user
    }

    async mount(data: UserDTO): Promise<UserDTO> {
        const user = new UserDTO()
        user.name = data?.name
        user.lastName = data?.lastName
        user.email = data.email
        user.password = data.password
        return user
    }

    async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hashSync(password, salt)
        return hashedPassword
    }

    async auth(data: AuthUserDTO): Promise<any> {
        const user = await this.findAndValidateUserData(data)
        if (user) {
            const jwt = await this.generateJWT(user)
            return {
                authorization: jwt,
                userName: user.name
            }
        }
    }

    async findAndValidateUserData(data: AuthUserDTO): Promise<User> {
        const user = await this.findByEmail(data.email)
        if (user) {
            const passwordIsValid = await bcrypt.compareSync(data.password, user.password)
            if (passwordIsValid) {
                return user
            } else {
                throw new HttpException("Invalid password", 400)
            }
        } else {
            throw new HttpException("User not found", 404)
        }
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        return user
    }

    async generateJWT(user: User): Promise<string | undefined> {
        const token = await jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })
        if (token) {
            return `Bearer ${token}`
        } else {
            throw new HttpException("Internal server error", 500)
        }
    }

    async recoverPass(email: string) {
        const user = await this.findByEmail(email)
        if (user) {
            const passwordToken = await this.passwordTokensService.createNewToken(user.id)
            await this.mailerService.sendMailToResetPassword(user, passwordToken)
            return
        }
        throw new HttpException("User not found", 404)
    }

    async validatePasswordToken(token: string): Promise<null> {
        const validatedToken = await this.passwordTokensService.findByToken(token)
        if (validatedToken) {
            const user = await this.prisma.user.findFirst({ where: { id: validatedToken.userId } })
            if (user) {
                return;
            }
            throw new HttpException("User not found", 404)
        }
    }

    async updatePassword(data: ChangePasswordDTO): Promise<null> {
        const validatedToken = await this.passwordTokensService.findByToken(data.token)
        if (validatedToken) {
            const user = await this.prisma.user.findFirst({ where: { id: validatedToken.userId } })
            if (user) {
                const mountedPassword = await this.encryptPassword(data.newPassword)
                const mountedUser = await this.mount({ ...user, password: mountedPassword })
                await Promise.all([this.prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        ...mountedUser
                    }
                }),
                this.passwordTokensService.invalidateToken(validatedToken.id)])
                return
            }
            throw new HttpException("User not found", 404)
        }
    }
}