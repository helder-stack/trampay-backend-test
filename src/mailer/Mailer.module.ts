import { Module } from "@nestjs/common";
import MailerService from "./Mailer.service";

@Module({
    imports: [],
    providers: [MailerService],
    exports:[MailerService]
})
export default class MailerModule{}