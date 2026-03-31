import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace-service';
import { Workspace } from '../../../models/Workspace';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/User';
import { MapComponent } from '../../map/map-component/map-component';
import { CalendarEvent, CalendarWeekViewComponent } from 'angular-calendar';
import { ReservationsService } from '../../../services/reservations-service';
import { Reservation, ReservationStatus } from '../../../models/Reservation';
import { CommonModule } from '@angular/common';
import { ReactionType, WorkspaceReaction } from '../../../models/WorkspaceReaction';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../models/Comment';
import { UtilityService } from '../../../services/utility-service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { GalleryComponent } from '../../gallery/gallery-component/gallery-component';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-space-details-component',
  imports: [MapComponent, CalendarWeekViewComponent, CommonModule, FormsModule, 
    MatGridListModule, MatDialogModule, GalleryComponent,
    MatIcon
  ],
  templateUrl: './space-details-component.html',
  styleUrl: './space-details-component.css',
})
export class SpaceDetailsComponent implements OnInit{

  private route = inject(ActivatedRoute)
  private wsService = inject(WorkspaceService)
  private userService = inject(UserService)
  private reservationService = inject(ReservationsService)
  private utilityService = inject(UtilityService)

  workspaceID = ""
  companyID = "" 
  type = "" // open, office, conf
  officeCapacity = 0 // if office is chosen
  userCanLikeWorkspace = false
  userCanCommentWorkspace = false
  commentText = ""

  workspace: Workspace = new Workspace()
  manager: User = new User()
  address = "" // address to show on map

  // reservations
  events: CalendarEvent[] = []
  loggedUser = false
  viewDate: Date = new Date()
  weekStartsOn = 1 // week starts on monday
  reservation: Reservation = new Reservation()

  clickStep: 'start' | 'end' = 'start'; // does user choosing start or end date
  successMessage = ""
  errorMessage = ""

  rooms: any[] = [] // list of conf rooms or offices
  currentRoomIndex = 0 // which room (conference or office) is currently active (selected)
  currentRoomEvents: CalendarEvent[] = [] // events for that room

  clientOk = false

  // last 10 comments
  comments: Comment[] = []

  loadData(){
    this.workspaceID = this.route.snapshot.paramMap.get("workspaceID")!
    let details = JSON.parse(this.route.snapshot.paramMap.get("details")!)
    
    if(details){
      this.type = details.type
      this.officeCapacity = details.officeCapacity
    }

    // show calendars only for logged users
    const user = localStorage.getItem("loggedIn")
    if(user==null)
      this.loggedUser = false
    else
      this.loggedUser = true
    // if(this.type!="")
    //   this.loggedUser = true

    this.wsService.getWorkspaceDetails(this.workspaceID).subscribe(data=>{
      this.workspace = data
      let managerUsername = data.manager
      this.address = this.workspace.address + ", "+this.workspace.city

      this.wsService.getLastComments(this.workspaceID).subscribe(comm=>{
        this.comments = comm
      })

      if(this.type === 'office' && this.workspace.offices.length > 0){
        this.rooms = this.workspace.offices
        this.currentRoomIndex = 0
        this.loadReservationsForCurrentRoom()
      } 
      else if(this.type === 'conf' && this.workspace.confRooms.length > 0){
        this.rooms = this.workspace.confRooms
        this.currentRoomIndex = 0
        this.loadReservationsForCurrentRoom()
      } 
      else if(this.type === 'open') {
        // there is just one open space
        this.rooms = [this.workspace.openSpace]
        this.currentRoomIndex = 0
        this.loadReservationsForCurrentRoom()
      }

      this.userService.getUserInfo(managerUsername).subscribe(manager=>{
        this.workspace.manager = manager
      })

      // logged user will potentially make the reservation
      let user = localStorage.getItem("loggedIn")
      this.reservation.user = JSON.parse(user!)

      if(this.loggedUser){
        this.userCanLike()
        this.userCanComment()
      }

      this.reservation.workspace = this.workspace
      this.reservation.status = ReservationStatus.RESERVED
      if(this.type==='open')
        this.reservation.spaceName = this.workspace.openSpace.name

      // can this client reserve workspace
      if(this.loggedUser){
        this.reservationService.clientCanReserveWorkspace(this.workspaceID, this.reservation.user.username).subscribe(res=>{
          if(res==true)
            this.clientOk = true
          else{
            this.clientOk = false
          }
        })
      }
    })
  }

  ngOnInit(): void {
    this.loadData()
  }

  prevRoom() {
    if(this.rooms.length <= 1) 
      return
    this.currentRoomIndex = (this.currentRoomIndex - 1 + this.rooms.length) % this.rooms.length
    this.loadReservationsForCurrentRoom()
  }

  nextRoom() {
    if(this.rooms.length <= 1) 
      return
    this.currentRoomIndex = (this.currentRoomIndex + 1) % this.rooms.length
    this.loadReservationsForCurrentRoom()
  }

  prevWeek() {
    const d = new Date(this.viewDate)
    d.setDate(d.getDate() - 7)
    this.viewDate = d
    this.loadReservationsForCurrentRoom()
  }

  nextWeek() {
    const d = new Date(this.viewDate)
    d.setDate(d.getDate() + 7)
    this.viewDate = d
    this.loadReservationsForCurrentRoom()
  }

  today() {
    this.viewDate = new Date()
  }

  getWeekRange(): string {
    const first = new Date(this.viewDate)
    const day = first.getDay() // 0 = Sunday, 1 = Monday
    const diff = (day + 6) % 7 // ako weekStartsOn = Monday
    first.setDate(first.getDate() - diff)
    first.setHours(0,0,0,0)

    const last = new Date(first);
    last.setDate(first.getDate() + 6)
    last.setHours(23,59,59,999)

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
    return `${first.toLocaleDateString('en-US', options)} - ${last.toLocaleDateString('en-US', options)}`;
  }

  get currentRoom() {
    return this.rooms[this.currentRoomIndex]
  }

  loadReservationsForCurrentRoom() {
  if(!this.currentRoom) return;

  this.reservation.spaceName = this.currentRoom.name

  const first = new Date(this.viewDate)
  const day = first.getDay()
  const diff = (day + 6) % 7   // Monday start

  first.setDate(first.getDate() - diff)
  first.setHours(0,0,0,0)

  const last = new Date(first)
  last.setDate(first.getDate() + 6)
  last.setHours(23,59,59,999)

  this.reservationService.getReservationsForWorkspaceAndRoom(
    this.workspaceID,
    this.currentRoom.name,
    first,
    last
  ).subscribe(reservations => {

    this.currentRoomEvents = reservations.map(r => ({
      start: new Date(r.startTime),
      end: new Date(r.endTime),
      title: r.user.firstname + ' ' + r.user.lastname,
      color: { primary: '#ad2121', secondary: '#FAE3E3' },
      allDay: false
    }))
  })
}

  reserve(event: any){
    const clickedDate = event.date
    if(this.clickStep==='end' && this.reservation.date !== clickedDate.toISOString().split('T')[0]){
      alert('End time must be on the same day as start time.')
      return
    }
    if(this.clickStep==='start'){
      // first click - user is choosing start time
      this.reservation.date = clickedDate.toISOString().split('T')[0]
      this.reservation.startTime = clickedDate.toTimeString().slice(0,5)
      this.reservation.endTime = ""
      this.clickStep = 'end'
    }
    else{
      // second click - user is choosing end time
      this.reservation.endTime = clickedDate.toTimeString().slice(0,5)
      this.clickStep = 'start'
    }
  }
 

  confirmReservation() {
    if(!this.clientOk){
      this.errorMessage = "You can not reserve this workspace due to penalty points!"
      return
    }
    else if (!this.reservation.startTime || !this.reservation.endTime) {
      this.errorMessage = "Please select start and end time."
      return;
    }

    this.reservationService.createReservation(this.reservation).subscribe({
      next: (res) => {
        this.errorMessage = ""
        this.successMessage = res.message

        this.loadReservationsForCurrentRoom()

        this.reservation.startTime = ''
        this.reservation.endTime = ''
        this.clickStep = 'start'
      },
      error: (err) => {
        this.successMessage = "";
        this.errorMessage = err.error.message
      }
    });
  }

  userCanLike(){
    if(!this.loggedUser){
      this.userCanLikeWorkspace = false
      return
    }
    this.wsService.userCanLike(this.workspaceID, this.reservation.user.username).subscribe(res=>{
      this.userCanLikeWorkspace = res
    })
  }

  userCanComment(){
    if(!this.loggedUser){
      this.userCanCommentWorkspace = false
      return
    }
    this.wsService.userCanComment(this.workspaceID, this.reservation.user.username).subscribe(res=>{
      this.userCanCommentWorkspace = res
    })
  }


  react(type:string){
    let wsReaction = new WorkspaceReaction()
    wsReaction.type = type==='like' ? ReactionType.LIKE : ReactionType.DISLIKE
    wsReaction.user = this.reservation.user
    wsReaction.workspace = this.reservation.workspace

    this.wsService.react(wsReaction).subscribe({
      next: (res)=>{
        this.errorMessage = ""
        this.successMessage = res.body?.message!
        this.userCanLike()
        this.loadData()
      },
      error: (err)=>{
        this.successMessage = ""
        this.errorMessage = err.err.message
      }
    })
  }

  leaveComment(){
    let comment = new Comment()
    if(!this.commentText){
      this.errorMessage = "Comment must have text!"
      return
    }
    comment.text = this.commentText
    comment.user = this.reservation.user
    comment.workspace = this.reservation.workspace
    comment.createdAt = new Date().toISOString()

    this.wsService.leaveComment(comment).subscribe({
      next: (res)=>{
        this.errorMessage = ""
        this.successMessage = res.body?.message!
        this.userCanComment()
        this.loadData()
      },
      error: (err)=>{
        this.successMessage = ""
        this.errorMessage = err.err.message
      }
    })
  }

  myComment(comm:Comment):boolean{
    return comm.user.username === this.reservation.user.username
  }

  getImageUrl(imagePath: string): string {
    return this.utilityService.getImageUrl(imagePath)
  }
}
