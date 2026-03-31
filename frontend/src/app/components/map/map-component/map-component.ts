import * as L from 'leaflet';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css'],
})
export class MapComponent implements OnChanges{

  @Input() address: string = ''; // address from database

  map: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.address && this.address.trim() !== '') {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
      
      // wait for DOM to refresh
      setTimeout(() => {
        this.loadMap(this.address);
      }, 100);
    }
  }

  loadMap(address: string) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(res => res.json())
      .then((data: any) => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          // create map
          this.map = L.map('map').setView([lat, lon], 15);

          // tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(this.map);

          // custom pin
          const customIcon = L.icon({
            iconUrl: 'map-pin.png',   
            iconSize: [30, 30],             // width, height
            iconAnchor: [15, 40],  
            popupAnchor: [0, -40] 
          });


          // add marker
          L.marker([lat, lon], { icon: customIcon })
            .addTo(this.map)
            .bindPopup(address)
            .openPopup();

        } else {
          console.error("Adresa nije pronađena");
        }
      })
      .catch(err => console.error(err));
  }
}