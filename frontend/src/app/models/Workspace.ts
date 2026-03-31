import { Company } from "./Company"
import { ConferenceRoom } from "./ConferenceRoom"
import { Office } from "./Office"
import { OpenSpace } from "./OpenSpace"
import { User } from "./User"

export class Workspace {
    _id?= ""
    company: Company = new Company()
    workspaceName = ""
    pricePerHour = 0
    city = ""
    address = ""
    openSpace: OpenSpace = new OpenSpace()
    offices: Office[] = []
    confRooms: ConferenceRoom[] = []
    manager: User = new User()
    approved = false
    penaltyPoints = 0
    likesCount = 0
    dislikeCount = 0
    commentsCount = 0
    photos: string[] = []
    description = ""
}