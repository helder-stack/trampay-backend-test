import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import ClientsService from "./clients.service";
import CreateClientsDTO from "./DTOs/CreateClients.dto";

@Controller('clients')
export default class ClientsController {
    constructor(
        private service: ClientsService
    ) { }

    @Post('')
    registerClients(@Body() body: CreateClientsDTO, @Req() req) {
        return this.service.create(body, req.userId)
    }

    @Get('')
    findClients(@Req() req) {
        return this.service.findMyClients(req.userId)
    }
}