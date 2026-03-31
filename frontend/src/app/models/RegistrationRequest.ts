import { Company } from "./Company";
import { User } from "./User";

export class RegistrationRequest{
    userData = new User()
    companyData = new Company() // optional, only for managers
}