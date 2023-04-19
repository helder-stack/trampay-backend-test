import { IsDefined } from "class-validator";
import ClientsDTO from "./Clients.dto";

export default class CreateClientsDTO{
    @IsDefined()
    clients: ClientsDTO[]
}