import { User } from "./User";
import { Workspace } from "./Workspace";

export enum ReactionType{
    LIKE = "like",
    DISLIKE = "dislike"
}

export class WorkspaceReaction {
    workspace: Workspace = new Workspace()
    user: User = new User()
    type: ReactionType = ReactionType.LIKE
}