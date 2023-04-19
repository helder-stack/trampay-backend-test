import { Module } from "@nestjs/common";
import ClientsController from "./clients.controller";
import ClientsService from "./clients.service";
import { PrismaService } from "src/prisma.service";

@Module({
    imports: [],
    controllers: [ClientsController],
    providers: [ClientsService, PrismaService],
    exports: [ClientsService]
})
export default class ClientsModule{}