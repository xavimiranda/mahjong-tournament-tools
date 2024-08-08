import { Injectable } from '@angular/core';
import toastr from 'toastr';


@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  public success(message: string, overrides?: ToastrOptions) {
    this.showToast('success', message, overrides)
  }

  public info(message: string, overrides?: ToastrOptions) {
    this.showToast('info', message, overrides)
  }

  public warn(message: string, overrides?: ToastrOptions) {
    this.showToast('warning', message, overrides)
  }

  public error(message: string, overrides?: ToastrOptions) {
    this.showToast('error', message, overrides)
  }

  private showToast(type: ToastrType, message: string, overrides: ToastrOptions = this.getDefaultOptions()) {
    toastr[type](message, '', overrides)
  }

  private getDefaultOptions(): ToastrOptions {
    return {
      timeOut: 5000,
    };
  }
}
