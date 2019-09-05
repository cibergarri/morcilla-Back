import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { timer } from 'rxjs';

@Injectable()
export class AlertsService {

  private errorMap = {
    "0": "Error de conexión. Comprueba tu acceso a Internet",
    "401": "Tu sesión ha caducado. Por favor, accede de nuevo",
    "403": "No tienes permisos para acceder a esta parte del sistema",
    "404": "Error - No se encontraron datos del usuario",
    "409": "No se pudo realizar la operación. Inténtalo más tarde",
    "412": "Versión desactualizada",
    "500": "Ocurrió un error al procesar tu solicitud"
  };
  private currentToastId: number = 0;
  public toasts: Toast[] = [];

  constructor() {
  }

  private getToastDataForError(error) : Toast {
    const t: Toast = { toastId: 0, text: '', type: ToastType.ERROR }
    let message: string = this.errorMap["500"];
    if (error["name"] === "TimeoutError")
      message = this.errorMap["0"];
    else if (error.obsCustomMessage)
      message = error.message || this.errorMap["500"];
    else if (error instanceof HttpErrorResponse) {
      if (error.status === 401)
        t.type = ToastType.INFO;
      if (error.error instanceof Error) {
        message = this.errorMap["0"];
      } else {
        message = this.errorMap[error.status.toString()] || this.errorMap["500"];
      }
    }
    t.text = message;
    t.toastId = this.currentToastId++;
    return t;
  }

  getErrorMessageForStatus(error) {
    const t: Toast = this.getToastDataForError(error);
    this.addToast(t);
  }

  private addToast(t: Toast) {
    this.toasts.push(t);
    timer(4000).subscribe(() => this.toasts = this.toasts.filter(to => to.toastId != t.toastId));
  }

  showMessage(message: string, type: ToastType | string = ToastType.INFO) {
    this.addToast({ text: message, type: type.toString(), toastId: this.currentToastId++ });
  }

  webCloseToast(t) {
    this.toasts = this.toasts.filter(to => to.toastId != t.toastId)
  }

  showMessageIfNotPresent(message: string, type: ToastType | string = ToastType.INFO){
    if (!this.toasts.find(e => e.text == message))
      this.addToast({ text: message, type: type.toString(), toastId: this.currentToastId++ });
  }

  getErrorMessageForStatusIfNotPresent(error) {
    const t: Toast = this.getToastDataForError(error);
    if (!this.toasts.find(e => e.text == t.text))
      this.addToast(t);
  }

}

class Toast {
  toastId: number;
  text: string;
  type: string;
}

export enum ToastType {
  INFO = "info",
  SUCCESS = "success",
  ERROR = "danger",
}
