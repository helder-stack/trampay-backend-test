import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import MailerModule from './mailer/Mailer.module';
import PasswordTokensModule from './password-tokens/Password-tokens.module';
import ClientsModule from './clients/clients.module';
import { AuthMiddleware } from './Middlewares/Auth.middleware';

@Module({
  imports: [UserModule, MailerModule, PasswordTokensModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('clients');
  }

}
