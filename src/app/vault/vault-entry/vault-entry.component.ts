import { Component, computed, inject, input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-vault-entry',
  standalone: true,
  imports: [],
  templateUrl: './vault-entry.component.html',
  styleUrl: './vault-entry.component.scss',
})
export class VaultEntryComponent implements OnInit {
  entryName = input.required<string>();
  isCurrent: boolean = false;
  isPreview = input<boolean>(false);
  showSetCurrent = input<boolean>(false);

  onDelete = output();
  deleteConfirm = signal<boolean>(false);
  setAsCurrentConfirm = signal<boolean>(false);

  areYouSureSetCurrentTimer: NodeJS.Timeout | null = null;
  areYouSureDeleteTimer: NodeJS.Timeout | null = null;

  toastr = inject(ToastrService);
  ngOnInit(): void {
    if (this.entryName() === 'CURRENT') this.isCurrent = true;
  }

  deleteEntry() {
    this.deleteConfirm.set(true);
  }

  private getEntryName = () => (this.isCurrent ? 'MTT-TOURNAMENT' : `MTT-SAVE-${this.entryName()}`);

  confirmDelete() {
    const entry = this.getEntryName();
    localStorage.removeItem(entry);
    this.onDelete.emit();
  }

  copyEntry() {
    const entry = this.getEntryName();
    navigator.clipboard.writeText(localStorage.getItem(entry)!);
    this.toastr.success(`${this.entryName()} copied to the clipboard!`);
  }

  confirmSetAsCurrent() {
    const entry = this.isCurrent ? 'MTT-TOURNAMENT' : `MTT-SAVE-${this.entryName()}`;
    localStorage.setItem('MTT-TOURNAMENT', localStorage.getItem(entry)!);
    this.toastr.success(`Replaced CURRENT with ${this.entryName()}`);
  }
  setAsCurrent() {
    this.setAsCurrentConfirm.set(true);
  }

  stopTimer(timer: NodeJS.Timeout | null) {
    if (timer) clearTimeout(timer);
  }

  startTimer(timer: NodeJS.Timeout | null, signal: WritableSignal<boolean>) {

    timer = setTimeout(() => {
      signal.set(false);
    }, 3000);
  }
}
