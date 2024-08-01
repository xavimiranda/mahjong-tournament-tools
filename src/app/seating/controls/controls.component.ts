import { Component, inject } from '@angular/core';
import { SeatingService } from '../seating.service';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [FormsModule, NgxSpinnerModule],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent {
  private seatingService = inject(SeatingService);
  playerCount = 0;
  rounds = 0;

  generateSeatings() {
    this.seatingService.getSeatingChart(this.playerCount, this.rounds);
  }

  async playerFileChanged(event: Event) {
    let file = (event.target as HTMLInputElement).files?.item(0);
    let playerNames: string[] = [];
    if (file && file.type === 'text/plain' && file.name.endsWith('.txt'))
      await file.text().then((text) => {
        playerNames = text.split('\n');
      });
    this.seatingService.loadPlayerNames(playerNames);
  }
}
