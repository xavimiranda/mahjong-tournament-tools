import { ElementRef, Injectable, viewChild } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  printElementRef(elem: ElementRef<HTMLElement> | undefined) {
    if (!elem || !elem?.nativeElement) return;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = elem.nativeElement.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
  }
}
