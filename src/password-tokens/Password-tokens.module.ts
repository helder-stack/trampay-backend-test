import { Module } from "@nestjs/common";
import PasswordTokensService from "./Password-tokens.service";
import { PrismaService } from "src/prisma.service";

@Module({
    imports:[],
    providers: [PasswordTokensService, PrismaService],
    exports: [PasswordTokensService]
})
export default class PasswordTokensModule{}