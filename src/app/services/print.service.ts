import { ElementRef, inject, Injectable, viewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxPrintService, PrintOptions } from 'ngx-print';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  printService = inject(NgxPrintService);

printElem(elemId: string) {
  const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: elemId,
      useExistingCss: true
  });
  this.printService.print(customPrintOptions)
}

}
