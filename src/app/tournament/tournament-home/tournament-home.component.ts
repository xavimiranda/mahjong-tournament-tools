import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EncodingService } from '../../services/encoding.service';
import { TournamentService } from '../tournament.service';
import { ControlsComponent } from "../controls/controls.component";
import { JsonPipe } from '@angular/common';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-tournament-home',
  standalone: true,
  imports: [FormsModule, ControlsComponent, JsonPipe, TableComponent],
  templateUrl: './tournament-home.component.html',
  styleUrl: './tournament-home.component.scss'
})
export class TournamentHomeComponent {
  loadString: string = ''

  tournamentService = inject(TournamentService)

loadSeating() {
  this.tournamentService.loadTournament(this.loadString)
}

}
