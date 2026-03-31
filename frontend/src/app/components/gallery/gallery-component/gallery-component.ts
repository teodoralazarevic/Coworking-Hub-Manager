import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../../services/utility-service';
import { ImageDialogComponent } from '../image-dialog-component/image-dialog-component';

@Component({
  selector: 'app-gallery-component',
  imports: [CommonModule, MatGridListModule, MatDialogModule],
  templateUrl: './gallery-component.html',
  styleUrl: './gallery-component.css',
  standalone: true
})
export class GalleryComponent implements OnChanges{

  private utilityService = inject(UtilityService)
  private dialog = inject(MatDialog)

  @Input() photos: string[] = []
  @Input() loggedIn = false
  @Input() workspaceID = ""

  selectedPhoto = ""

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['photos'] && this.photos.length > 0) {

      const cookieName = `workspace_${this.workspaceID}_photo`
      const saved = this.getCookie(cookieName)

      if (saved && this.photos.includes(saved))
        this.selectedPhoto = saved
      else
        this.selectedPhoto = this.photos[0]
    }
  }

  selectPhoto(photo: string){
    this.selectedPhoto = photo

    const cookieName = `workspace_${this.workspaceID}_photo`
    document.cookie = `${cookieName}=${photo}; path=/; max-age=31536000`
  }

  getCookie(name: string){
    const cookies = document.cookie.split(';')

    for(let c of cookies){
      const [key,val] = c.trim().split('=')
      if(key === name) return val
    }

    return null
  }

  openImage(photo: string) {
    const index = this.photos.indexOf(photo)

    this.dialog.open(ImageDialogComponent, {
      data: { photos: this.photos, index: index},
      panelClass: 'custom-dialog-container'
    });
  }

  getImageUrl(photo: string) {
    return this.utilityService.getImageUrl(photo)
  }
}


