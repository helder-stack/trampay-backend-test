import { IsDefined } from "class-validator";

export default class ClientsDTO{
    @IsDefined()
    doc: string;
    @IsDefined()
    balance: string;
}