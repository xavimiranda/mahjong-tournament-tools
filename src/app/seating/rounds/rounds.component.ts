import { Component, inject } from '@angular/core';
import { SeatingService } from '../seating.service';

@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss'
})
export class RoundsComponent {
  seatingService = inject(SeatingService)
}
