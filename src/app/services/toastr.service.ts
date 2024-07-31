import { Injectable } from '@angular/core';
import toastr from 'toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  public success(message: string) {
    toastr.success(message)
  }

  public warn(message: string){
    toastr.warning(message)
  }

  public error(message: string){
    toastr.error(message, '', this.getOptions())
  }

  private getOptions(): ToastrOptions {
    return {
      timeOut: 10000
    }
  }
}
