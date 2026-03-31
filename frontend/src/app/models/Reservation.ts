import { User } from "./User";
import { Workspace } from "./Workspace";

export enum ReservationStatus{
    RESERVED = 'reserved',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show'
}

export class Reservation{
    _id = ""
    user: User = new User()
    workspace: Workspace = new Workspace()
    spaceName = ""
    status : ReservationStatus = ReservationStatus.RESERVED
    date = ""
    startTime = ""
    endTime = ""
}