import { Component, Input } from '@angular/core';

@Component({
  selector: 'location-status',
  templateUrl: 'location-status.html'
})
export class LocationStatusComponent {
  @Input() status: boolean;
}
