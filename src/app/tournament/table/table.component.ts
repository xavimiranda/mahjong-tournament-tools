import { Component, inject, input } from '@angular/core';
import { Table } from '../../models/tournament';
import { TournamentService } from '../tournament.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  table = input.required<Table>();
  roundNumber = input.required<number>();
  tournamentService = inject(TournamentService);
}
