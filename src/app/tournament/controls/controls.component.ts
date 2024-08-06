import { AfterContentInit, AfterViewInit, Component, computed, effect, inject, input, output } from '@angular/core';
import { TournamentService } from '../tournament.service';
import { FormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import moment from 'moment';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tournament-controls',
  standalone: true,
  imports: [FormsModule, CollapseModule, BsDatepickerModule, NgIf],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent implements AfterContentInit {
  ngAfterContentInit(): void {
    const settings = this.tournamentService.tournament()?.settings;
    this.hours = settings?.roundDuration.hours() || 0;
    this.minutes = settings?.roundDuration.minutes() || 0;
    this.duration = this.tournamentService.tournament()?.settings.roundDuration.toISOString().slice(2)
  }

  tournamentService = inject(TournamentService);
  pointsCollapsed = true;
  roundsCollapsed = true;
  printCollapsed = false;
  saveCollapsed= true;
  duration?: string
  hours = 0;
  minutes = 0;

  setRoundDuration() {
    this.tournamentService.tournament.update((cur) => {
      if (cur?.settings.roundDuration)
        cur.settings.roundDuration = moment.duration({ hour: this.hours, minute: this.minutes });
      this.duration = this.tournamentService.tournament()?.settings.roundDuration.toISOString().slice(2);
      return cur;
    });
  }

  getDatePickConfig(): Partial<BsDatepickerConfig> {
    return {
      containerClass: 'theme-dark-blue',
      withTimepicker: true,
      dateInputFormat: 'MMM DD YYYY, HH:mm',
      adaptivePosition: true,
      keepDatepickerOpened: true,
    };
  }

  onPrintTables = output();
  printTables() {
    this.onPrintTables.emit();
  }

  onPrintPlayerList = output();
  printPlayerList() {
    this.onPrintPlayerList.emit();
  }


}
