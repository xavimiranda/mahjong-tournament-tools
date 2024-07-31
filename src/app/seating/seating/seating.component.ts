import { Component } from '@angular/core';
import { ControlsComponent } from "../controls/controls.component";
import { RoundsComponent } from "../rounds/rounds.component";

@Component({
  selector: 'app-seating',
  standalone: true,
  imports: [ControlsComponent, RoundsComponent],
  templateUrl: './seating.component.html',
  styleUrl: './seating.component.scss'
})
export class SeatingComponent {

}
