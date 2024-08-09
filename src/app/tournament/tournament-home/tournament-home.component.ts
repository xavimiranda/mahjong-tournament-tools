import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '../tournament.service';
import { ControlsComponent } from '../controls/controls.component';
import { JsonPipe } from '@angular/common';
import { TableComponent } from '../table/table.component';
import { DatesService } from '../../services/dates.service';
import { PrintService } from '../../services/print.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PlayerListComponent } from "../player-list/player-list.component";
import { PlayerScoresComponent } from "../player-scores/player-scores.component";
import { PlayerTablesComponent } from "../player-tables/player-tables.component";

@Component({
  selector: 'app-tournament-home',
  standalone: true,
  imports: [FormsModule, ControlsComponent, JsonPipe, TableComponent, TabsModule, PlayerListComponent, PlayerScoresComponent, PlayerTablesComponent],
  templateUrl: './tournament-home.component.html',
  styleUrl: './tournament-home.component.scss',
})
export class TournamentHomeComponent {
  loadString: string = '';
  tables = viewChild<ElementRef<HTMLDivElement>>('tables');
  printService = inject(PrintService);
  datesService = inject(DatesService);
  showTables = signal<boolean>(true);

  toggleShowTables()  {
    this.showTables.update(cur => !cur)
  }

  tournamentService = inject(TournamentService);
  settings = computed(() => this.tournamentService.tournament()?.settings);

  async loadSeating(source: 'clip' | 'localStorage') {
    if(source === 'clip')
      this.loadString = await window.navigator.clipboard.readText()
    if(source === 'localStorage')
      this.loadString = localStorage.getItem('MTT-SEATINGS') ?? ''

    this.tournamentService.loadTournament(this.loadString);
  }

  print(id: string) {
      this.printService.printElem(id)
  }
}
