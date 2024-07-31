import { Component, inject } from '@angular/core';
import { SeatingService } from '../seating.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [NgxSpinnerModule],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss'
})
export class RoundsComponent {
  seatingService = inject(SeatingService)
}
