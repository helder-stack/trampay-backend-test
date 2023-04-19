import { HttpException, Injectable } from "@nestjs/common";
import CreateClientsDTO from "./DTOs/CreateClients.dto";
import IClientsService from "./Interfaces/IClientsService";
import ClientsDTO from "./DTOs/Clients.dto";
import Client from "./Models/Client.model";
import { PrismaService } from "src/prisma.service";

@Injectable()
export default class ClientsService implements IClientsService {

    constructor(
        private prisma: PrismaService
    ) { }

    async create(data: CreateClientsDTO, creatorId: number): Promise<any> {
        const errors = []
        const filteredClients = await this.filterClients(data, creatorId)
        for (const mountedClient of filteredClients) {
            try {
                const [user] = await this.findClientByDocument(mountedClient.doc)
                if (user) {
                    const userCreatingDate = new Date(user.createdAt)
                    const userRegisteredToday = this.validateUserCreatingDate(userCreatingDate, new Date())
                    if (userRegisteredToday) {
                        mountedClient.balance += user.balance
                        await this.invalidateClientRegister(user)
                    }
                }
                await this.prisma.client.create({
                    data: mountedClient
                })
            } catch (e) {
                errors.push(mountedClient)
            }
        }
    }

    async filterClients(clients: CreateClientsDTO, creatorId: number) {
        const filteredClients = []
        for (const client of clients.clients) {
            const mountedClient = this.mount(client, creatorId)
            const isRepeated = filteredClients.findIndex(c => c.doc == mountedClient.doc)
            if (isRepeated != -1) {
                filteredClients[isRepeated].balance += mountedClient.balance
            } else {
                filteredClients.push(mountedClient)
            }
        }
        return filteredClients
    }

    mount(data: ClientsDTO, creatorId: number): Client {
        const client = new Client()
        client.balance = parseFloat(data.balance)
        client.doc = data.doc
        client.registeredBy = creatorId
        return client
    }

    async findClientByDocument(doc: string): Promise<Client[]> {
        return this.prisma.client.findMany({
            where: {
                doc
            },
            orderBy: [
                {
                    id: 'desc'
                }
            ]
        })
    }

    async invalidateClientRegister(client: Client): Promise<void> {
        await this.prisma.client.update({
            where: {
                id: client.id
            },
            data: {
                ...client,
                deletedAt: new Date()
            }
        })
    }

    async findMyClients(registeredBy: number): Promise<Client[]> {
        const clients = await this.prisma.client.findMany({
            where: {
                registeredBy
            }
        })
        return clients
    }

    validateUserCreatingDate(userCreatingDate: Date, currentDate: Date) {
        if (
            userCreatingDate.getDate() == currentDate.getDate() &&
            userCreatingDate.getMonth() + 1 == currentDate.getMonth() + 1 &&
            userCreatingDate.getFullYear() == currentDate.getFullYear()
        ) {
            return true
        }
        return false
    }
}