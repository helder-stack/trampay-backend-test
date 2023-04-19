import { HttpException, Injectable } from "@nestjs/common";
import * as nanoid from "nanoid";
import PasswordToken from "./Models/PasswordToken.model";
import { PrismaService } from "src/prisma.service";

@Injectable()
export default class PasswordTokensService {

    constructor(
        private prisma: PrismaService
    ) { }

    async createNewToken(userId: number) {
        try {
            const passwordToken = await this.mount(userId)
            const createdToken = await this.prisma.passwordTokens.create({
                data: passwordToken
            })
            return createdToken
        } catch (e) {
            console.error(e)
            throw new HttpException("Internal server error", 500)
        }
    }

    async mount(userId: number): Promise<PasswordToken> {
        const token = await this.generateToken()
        const passwordToken = new PasswordToken()
        passwordToken.userId = userId
        passwordToken.token = token
        passwordToken.expiresAt = this.generateExpiresAt()
        return passwordToken
    }

    async generateToken(): Promise<string> {
        let token = '';
        for (let index = 0; index < 6; index++) {
            token += nanoid(4)
        }
        return token
    }

    generateExpiresAt() {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        return date
    }

    async findByToken(token: string): Promise<PasswordToken> {
        const findedToken = await this.prisma.passwordTokens.findFirst({
            where: {
                token
            }
        })
        if(findedToken && !findedToken.isValidated){
            const expiringDate = new Date(findedToken.expiresAt)
            const currentDate = new Date()
            if(currentDate < expiringDate){
                return findedToken 
            }
        }
        throw new HttpException("Token not found", 404)
    }

    async invalidateToken(id: number): Promise<null>{
        await this.prisma.passwordTokens.update({
            where: {id},
            data: {
                isValidated: true
            }
        })
        return
    }
}