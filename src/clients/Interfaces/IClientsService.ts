import ClientsDTO from "../DTOs/Clients.dto";
import CreateClientsDTO from "../DTOs/CreateClients.dto";
import Client from "../Models/Client.model";

export default interface IClientsService {

    create(data: CreateClientsDTO, creatorId: number): Promise<null>;
    mount(data: ClientsDTO, creatorId: number): Client;
    findClientByDocument(doc: string): Promise<Client[]>;
    invalidateClientRegister(client: Client): Promise<void>;
    findMyClients(registeredBy: number): Promise<Client[]>
}