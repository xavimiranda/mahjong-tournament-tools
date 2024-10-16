import { Component, inject, signal } from '@angular/core';
import { SeatingService } from '../seating.service';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ToastrService } from '../../services/toastr.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { GroupsComponent } from './groups/groups.component';
import Papa from 'papaparse';
import { Player, PlayerCSV } from '../../models/player';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [FormsModule, NgxSpinnerModule, PopoverModule, TypeaheadModule, GroupsComponent, CollapseModule],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent {
  seatingService = inject(SeatingService);
  playerCount = 0;
  rounds = 0;
  playersFile = '';
  playerCountChanged = signal<boolean>(false);
  avoidCollapsed = true
  forbidCollapsed = true
  fillWithSubs = false

  private toastr = inject(ToastrService);

  generateSeatings() {
    const leftOutPlayers = this.playerCount % 4;
    if (!this.fillWithSubs && leftOutPlayers > 0)
      this.toastr.warn(`The player count is not a multiple of 4. The last ${leftOutPlayers} will be left out!`);

    if(this.fillWithSubs) {
      this.playerCount += leftOutPlayers
      this.seatingService.addSubstitutePlayers(leftOutPlayers)
    }

    this.seatingService.generateSeatings(this.playerCount, this.rounds);
  }

  async playerFileChanged(event: Event) {
    const elem = event.target as HTMLInputElement;
    let file = elem.files?.item(0);

    if (!file || (file.type != 'text/plain' && file.type != 'text/csv')) {
      this.toastr.error(
        "Something went wrong reading your file! Make sure it's a valid file with a player per line",
      );
      this.playersFile = '';
      this.playerCountChanged.set(false);
      return;
    }
    this.playersFile = file.name;

    let players: string[] = [];

    await file.text().then((text) => {
      players = text.split('\n');
    });
    players = players.filter(p => p !== '');
    this.playerCount = players.length - 1;

    const leftOutPlayers = this.playerCount % 4;
    if (leftOutPlayers > 0)
      this.toastr.warn(`The player count is not a multiple of 4!`);

    if (this.playerCount > players.length)
      this.toastr.warn(
        `The list of players names is shorter than the player count. Some players will go unnamed if you continue`,
      );
    
    Papa.parse<PlayerCSV>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: this.cleanHeader,
      complete: (results, file) => {
        this.seatingService.loadPlayers(results.data)
      },
    });
  }
  private cleanHeader(header: string) {
    return header
      .replace(/\s(\w)/g, (subs, g1) => `${g1.toUpperCase()}`)
      .replace(/^\w/, (s) => s.toLowerCase())
      .replace('"', '');
  }
  onPlayerCountChanged() {
    if (this.playersFile) this.playerCountChanged.set(true);
  }

  copyArrangement() {
    this.seatingService.saveSeatingsToClipboard(this.playerCount);
  }

saveToLocalStorage() {
  localStorage.setItem('MTT-SEATINGS', this.seatingService.getEncodedSeatings(this.playerCount))
  this.toastr.success("Saved in your brower")
}
}
