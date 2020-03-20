import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class LocationProvider {
  location: any;
  constructor(private geolocation: Geolocation) { }

  getLocation() {
    return this.geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: true });
  }

}