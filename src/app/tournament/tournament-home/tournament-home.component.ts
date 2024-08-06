import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EncodingService } from '../../services/encoding.service';
import { TournamentService } from '../tournament.service';
import { ControlsComponent } from '../controls/controls.component';
import { JsonPipe } from '@angular/common';
import { TableComponent } from '../table/table.component';
import { DatesService } from '../../services/dates.service';
import { PrintService } from '../../services/print.service';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-tournament-home',
  standalone: true,
  imports: [FormsModule, ControlsComponent, JsonPipe, TableComponent, TabsModule],
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

  loadSeating() {
    this.tournamentService.loadTournament(this.loadString);
  }

  print(id: string) {
      this.printService.printElem(id)
  }
}
