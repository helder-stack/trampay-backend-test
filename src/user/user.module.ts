import { Module } from '@nestjs/common';
import UserController from './user.controller';
import UserService from './user.service';
import { PrismaService } from 'src/prisma.service';
import MailerModule from 'src/mailer/Mailer.module';
import PasswordTokensModule from 'src/password-tokens/Password-tokens.module';

@Module({
    imports: [MailerModule, PasswordTokensModule],
    controllers: [UserController],
    providers: [UserService, PrismaService],
    exports: []
})
export class UserModule {}
