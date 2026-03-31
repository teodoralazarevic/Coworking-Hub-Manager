import { Component, Inject, inject } from '@angular/core';
import { UtilityService } from '../../../services/utility-service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog-component',
  imports: [],
  templateUrl: './image-dialog-component.html',
  styleUrl: './image-dialog-component.css',
})
export class ImageDialogComponent {

  private utilityService = inject(UtilityService)
  private photosCnt = 0
  currentIndex: number


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentIndex = data.index
    this.photosCnt = this.data.photos.length
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.photosCnt
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.photosCnt) % this.photosCnt
  }

  getImageUrl(photo: string) {
    return this.utilityService.getImageUrl(photo)
  }
}
