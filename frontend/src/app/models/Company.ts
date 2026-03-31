import { User } from "./User"
import { Workspace } from "./Workspace"

export class Company{
    company_name = ""
    company_address = ""
    reg_number = "" // maticni broj
    tax_ident_number = "" // PIB
    manager1 = new User()
    manager2 = new User()
    // workspaces: Workspace[] = []
}