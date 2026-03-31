import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reservation } from '../models/Reservation';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {

  private http = inject(HttpClient)
  private uri = "http://localhost:4000/reservations"

  createReservation(reservation:Reservation){
    return this.http.post<Message>(`${this.uri}/createReservation`, reservation)
  }

  getReservationsForWorkspaceAndRoom(workspaceID:string, spaceName:string, first:Date, last:Date){
    const data = {
      workspaceID: workspaceID,
      spaceName: spaceName,
      start: first.toISOString(),
      end: last.toISOString()
    }
    return this.http.post<Reservation[]>(`${this.uri}/getReservationsForRoom`, data)
  }

  getUserReservations(username: string){
    const data = {
      username: username
    }
    return this.http.post<Reservation[]>(`${this.uri}/getUserReservations`, data)
  }

  cancelReservation(reservation:Reservation){
    return this.http.post<Message>(`${this.uri}/cancelReservation`, reservation, {observe: 'response'})
  }

  // get reservations for workspaces of this manager
  getManagerReservations(username: string){
    const data = {
      username: username
    }
    return this.http.post<Reservation[]>(`${this.uri}/getManagerReservations`, data)
  }

  clientShowedUp(reservationID: string, showed: boolean){
    const data = {
      reservationID: reservationID,
      showed: showed
    }
    return this.http.post<Message>(`${this.uri}/clientShowedUp`, data, {observe: 'response'})
  }

  // when client has max penalty points, he no longer can reserve that workspace
  clientCanReserveWorkspace(workspaceID: string, username: string){
    const data = {
      workspaceID: workspaceID,
      username: username
    }
    return this.http.post<boolean>(`${this.uri}/clientCanReserveWorkspace`, data)
  }


  checkRoomAvailability(workspaceId: string, roomName: string, startTime: string, endTime: string, excludeReservationId?: string) {
    const data = {
      workspaceId: workspaceId,
      roomName: roomName,
      start: startTime,
      end: endTime,
      exclude: excludeReservationId
    }
    return this.http.post<boolean>(`${this.uri}/checkRoomAvailability`, data, {observe:'response'});
  }

  rescheduleReservation(reservationId: string, newStartTime: string, newEndTime: string) {
    const data = {
      reservationId: reservationId,
      startTime: newStartTime,
      endTime: newEndTime
    }
    return this.http.post<boolean>(`${this.uri}/rescheduleReservation`, data)
  }

  getReservations(){
    return this.http.get<Reservation[]>(`${this.uri}/getAllReservations`, {observe: 'response'})
  }

}
