import { Injectable } from '@angular/core';
import moment, { Duration } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  formatDate(date: Date, format: string): string {
    return moment(date).format(format);
  }

  addDuration(date: Date, duration: Duration, format: string): string {
    return moment(date).add(duration).format(format)
  }
}
