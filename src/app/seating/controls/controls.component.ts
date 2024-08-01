import { Component, inject, signal } from '@angular/core';
import { SeatingService } from '../seating.service';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [FormsModule, NgxSpinnerModule,PopoverModule],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent {
  seatingService = inject(SeatingService);
  playerCount = 0;
  rounds = 0;
  playerNameFile = ''
  playerCountChanged = signal<boolean>(false)

  private toastr = inject(ToastrService)

  generateSeatings() {
    const leftOutPlayers = this.playerCount % 4;
    if(leftOutPlayers > 0)
      this.toastr.warn(`The player count is not a multiple of 4. The last ${leftOutPlayers} will be left out!`)
    this.seatingService.generateSeatings(this.playerCount, this.rounds);
  }

  async playerFileChanged(event: Event) {
    const elem = event.target as HTMLInputElement
    let file = elem.files?.item(0);

    if(!file || file.type !== 'text/plain' || !file.name.endsWith('.txt')) {
      this.toastr.error('Something went wrong reading your file! Make sure it\' a .txt file, with a player name per line')
      this.playerNameFile = ''
      this.playerCountChanged.set(false)
      return 
    }
    this.playerNameFile = file.name

    let playerNames: string[] = [];

    await file.text().then((text) => {
      playerNames = text.split('\n');
    });
    
    if(this.playerCount > playerNames.length)
      this.toastr.warn(`The list of players names is shorter than the player count. Some players will go unnamed if you continue`)
    this.seatingService.loadPlayerNames(playerNames);
  }

  onPlayerCountChanged() {
    if (this.playerNameFile)
      this.playerCountChanged.set(true)
  }

  copyArrangement() {
    this.seatingService.extractSeatings()
  }
}
