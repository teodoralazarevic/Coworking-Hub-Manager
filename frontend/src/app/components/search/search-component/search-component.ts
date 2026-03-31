import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Office } from '../../../models/Office';
import { ConferenceRoom } from '../../../models/ConferenceRoom';
import { OpenSpace } from '../../../models/OpenSpace';
import { WorkspaceService } from '../../../services/workspace-service';
import { P } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { Workspace } from '../../../models/Workspace';
import { Company } from '../../../models/Company';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-search-component',
  imports: [FormsModule, MatCardModule, MatButtonModule, MatFormFieldModule,
  MatIconModule, MatDividerModule, MatInputModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css',
})
export class SearchComponent implements OnInit{

  private wsService = inject(WorkspaceService)
  private router = inject(Router)

  name = "" // name of the space
  selectedCities: string[] = []
  cities: string[] = []
  errorMessage = ""

  resultsFound = false
  workspaces:Workspace[] = []

  // for memeber search
  memberSearch = false
  selectedType = ""
  officeCapacity = null


  ngOnInit(): void {
    let currentRoute = this.router.url
    if(currentRoute.includes("member"))
      this.memberSearch = true

    this.wsService.getCities().subscribe(cities=>{
      this.cities = cities
    })

    // if results from the previous search are available
    if(this.wsService.lastSearchResults){
      this.workspaces = this.wsService.lastSearchResults
      this.resultsFound = true
    }
    if(this.wsService.lastSearchParams){
      const params = this.wsService.lastSearchParams
      this.name = params.name
      this.selectedCities = params.selectedCities
      this.selectedType = params.selectedType
      this.officeCapacity = params.officeCapacity
    }
  }

  selectType(type:string){
    if(this.selectedType === type){
      // unselect
      this.selectedType = ""
      this.officeCapacity = null
    }
    else{
      this.selectedType = type
    }
  }

  sortDirections : any = {
    workspaceName: true,
    city: true
  }

  sort(column: 'workspaceName' | 'city') {
    this.sortDirections[column] = !this.sortDirections[column]
    this.workspaces.sort((a: Workspace, b: Workspace) => {

      let valueA: any = a[column]
      let valueB: any = b[column]

      if (typeof valueA === 'string') 
        valueA = valueA.toLowerCase()
      if (typeof valueB === 'string') 
        valueB = valueB.toLowerCase()

      if (valueA < valueB) 
        return this.sortDirections[column] ? -1 : 1
      if (valueA > valueB) 
        return this.sortDirections[column] ? 1 : -1
      return 0
    })

    this.workspaces = [...this.workspaces] // trigger angular refresh
  }

  handleResults(data:any){
    this.workspaces = data
    this.resultsFound = this.workspaces.length > 0
    this.wsService.lastSearchResults = data
    this.wsService.lastSearchParams = {
      name: this.name,
      cities: this.cities,
      selectedType: this.selectedType,
      officeCapacity: this.officeCapacity
    }

    this.selectedCities = []
    this.name = ""
  }

  search(){
    if(!this.memberSearch){
      this.wsService.searchGuest(this.name, this.selectedCities).subscribe(data=>{
        this.handleResults(data)
      })
    }
    else{
      if(!this.selectedType){
        this.errorMessage = "You need to pick one of the options above!"
        return
      }
      else if(this.selectedType==="office" && !this.officeCapacity){
        this.errorMessage = "You need to enter office capacity"
        return
      }
      this.wsService.searchMember(this.name, this.selectedCities, this.selectedType, this.officeCapacity).subscribe(data=>{
        this.handleResults(data)
        this.errorMessage=""
      })
    }
  }

  workspaceDetails(workspaceID:string|undefined){
    if(!this.memberSearch){
      this.router.navigate(['guest/space-details', workspaceID, 
      JSON.stringify({type: this.selectedType, officeCapacity: this.officeCapacity})])
    }
    else{
      this.router.navigate(['member/space-details', workspaceID, 
      JSON.stringify({type: this.selectedType, officeCapacity: this.officeCapacity})])
    }
  }

}


