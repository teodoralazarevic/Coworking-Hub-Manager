import { User } from "./User";
import { Workspace } from "./Workspace";

export class Comment{
    workspace: Workspace = new Workspace()
    user: User = new User()
    text = ""
    createdAt = ""
}