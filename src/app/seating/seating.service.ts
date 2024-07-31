import { inject, Injectable, OnDestroy, signal, Signal } from '@angular/core';
import { RoundResults } from 'good-enough-golfer';
import Pako from 'pako';
import { ToastrService } from '../services/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';

type NumberedSeatingMap = RoundResults;
type NamedSeatingMap = RoundResults & {
  namedRounds: string[][][];
};

@Injectable({
  providedIn: 'root',
})
export class SeatingService implements OnDestroy {
  seatingMap = signal<RoundResults | null>(null);
  isGeneratingSeats = signal<boolean>(false);
  names = signal<Map<number, string>>(new Map());
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);

  worker!: Worker;

  constructor() {
    this.worker = new Worker(new URL('./seating.worker', import.meta.url));
  }

  ngOnDestroy(): void {
    this.worker.terminate();
  }

  getSeatingChart(playerCount: number, rounds: number) {
    if (playerCount < 4) {
      this.toastr.error(
        'You need more than 4 players to plan out a tournament'
      );
      return;
    }
    this.seatingMap.set(null)
    const tableCount = Math.floor(playerCount / 4);

    this.spinner.show('rounds', {fullScreen: false})
    this.isGeneratingSeats.set(true)

    this.worker.postMessage({
      groups: tableCount,
      numberOfRounds: rounds,
    })
    // const results = generateRounds();
    this.worker.onmessage = ({data}) => {
      this.seatingMap.set(data);
      this.spinner.hide('rounds')
      this.isGeneratingSeats.set(false)
    }

  }

  loadPlayerNames(pNames: string[]) {
    pNames.forEach((name, i) => this.names().set(i, name));
  }

  getPlayerName(pNumber: number) {
    return this.names().has(pNumber)
      ? this.names().get(pNumber)
      : `Player ${pNumber + 1}`;
  }

  getPackedSeating() {
    const gzip = Pako.gzip(JSON.stringify(this.seatingMap()));

    const encodedData = btoa(String.fromCharCode(...gzip));
    console.log(encodedData);
    return encodedData;
  }

  unpackSeating(data: string) {
    const arr = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    const json = Pako.ungzip(arr, { to: 'string' });
    const parsed = JSON.parse(json);
    console.log(parsed);
    this.seatingMap.set(parsed);
  }
}
