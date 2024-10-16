import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '../../tournament/tournament.service';
import { EncodingService } from '../../services/encoding.service';
import { VaultEntryComponent } from '../vault-entry/vault-entry.component';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-vault-home',
  standalone: true,
  imports: [FormsModule, VaultEntryComponent],
  templateUrl: './vault-home.component.html',
  styleUrl: './vault-home.component.scss',
})
export class VaultHomeComponent implements OnInit {
  saveName: string = '';
  mttKeys = signal<string[]>([]);
  currentTournament = signal<string>('');

  tournamentService = inject(TournamentService);
  encodingService = inject(EncodingService);
  toast = inject(ToastrService);

  ngOnInit(): void {
    this.loadMttLocalStorageKeys();
  }

loadMttLocalStorageKeys() {
  const keys: string[] = [];
  const currentKeys = new Set(this.mttKeys());

  for (let i = 0, len = localStorage.length; i < len; i++) {
    const key = localStorage.key(i);
    if (key === 'MTT-TOURNAMENT') this.currentTournament.set('CURRENT');

    if (key?.startsWith('MTT-SAVE-')) {
      const entry = key.replace('MTT-SAVE-', '');
      if (!currentKeys.has(entry)) {
        keys.push(entry);
      }
    }
  }

  this.mttKeys.set(keys);
}


  newSave() {
    const newSaveName = 'MTT-SAVE-' + this.saveName.toUpperCase().replaceAll(' ', '-');
    if(!this.tournamentService.tournament) {
      toastr.error("Cannot save tournament")
      return
    }
      
    const encodedTournament = this.encodingService.encodeObject(this.tournamentService.tournament()!);
    localStorage.setItem(newSaveName, encodedTournament);
    this.saveName = '';
    this.loadMttLocalStorageKeys();
  }
}
