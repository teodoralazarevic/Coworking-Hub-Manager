import { ConferenceRoom } from "./ConferenceRoom";
import { Office } from "./Office";
import { OpenSpace } from "./OpenSpace";

export class SearchResponse{
    offices: Office[] = []
    confRooms: ConferenceRoom[] = []
    openSpaces: OpenSpace[] = []
}