import { Component, inject } from '@angular/core';
import { ControlsComponent } from '../controls/controls.component';
import { RoundsComponent } from '../rounds/rounds.component';
import { SeatingService } from '../seating.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-seating',
  standalone: true,
  imports: [ControlsComponent, RoundsComponent, NgxSpinnerModule],
  templateUrl: './seating.component.html',
  styleUrl: './seating.component.scss',
})
export class SeatingComponent {
  seatingService = inject(SeatingService);
}
