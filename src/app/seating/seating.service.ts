import { inject, Injectable, signal, Signal } from '@angular/core';
import {generateRounds, RoundResults} from 'good-enough-golfer'
import Pako from 'pako'
import { ToastrService } from '../services/toastr.service';

type NumberedSeatingMap = RoundResults
type NamedSeatingMap = RoundResults & {
  namedRounds: string[][][]
}

@Injectable({
  providedIn: 'root',
})
export class SeatingService {
  seatingMap = signal<RoundResults | null>(null);
  names = signal<Map<number, string>>(new Map());
  private toastr = inject(ToastrService)
  

  getSeatingChart(playerCount:number , rounds: number) {
    if(playerCount < 4) {
      this.toastr.error("You need more than 4 players to plan out a tournament")
      return 
    }
    const tableCount = Math.floor(playerCount/4);
    const results = generateRounds({groups: tableCount, numberOfRounds: rounds})

    this.seatingMap.set(results)
  }
  
  loadPlayerNames(pNames: string[]) {
    pNames.forEach((name, i) => this.names().set(i, name));
  }

  getPlayerName(pNumber: number) {
    return this.names().has(pNumber) ? this.names().get(pNumber) : `Player ${pNumber + 1}`
  }

  getPackedSeating() {
    const gzip = Pako.gzip(JSON.stringify(this.seatingMap()))

    const encodedData = btoa(String.fromCharCode(...gzip))
    console.log(encodedData)
    return encodedData 
  }

  unpackSeating(data: string) {
    const arr = Uint8Array.from(atob(data), c => c.charCodeAt(0))
    const json = Pako.ungzip(arr, {to: "string"})
    const parsed = JSON.parse(json)
    console.log(parsed);
    this.seatingMap.set(parsed)
  }

}