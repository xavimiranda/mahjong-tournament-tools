import { CanDeactivateFn } from '@angular/router';
import { SeatingComponent } from './seating/seating.component';
import { inject } from '@angular/core';
import { SeatingService } from './seating.service';
import { NgxSpinnerService } from 'ngx-spinner';

export const generationInProgressGuard: CanDeactivateFn<SeatingComponent> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  const seatingService = inject(SeatingService);
  const spinner = inject(NgxSpinnerService);

  if (seatingService.isGeneratingSeats()) {
    const isUserQuitting = confirm(
      'Seating for the Hanchan are still being generated. Do you want to interrupt the generation?',
    );

    if (isUserQuitting) {
      seatingService.worker.terminate();
      seatingService.isGeneratingSeats.set(false);
      spinner.hide(seatingService.seatGenSpinner)
      return isUserQuitting;
    }
  }
  return false;
};
