import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private errorMap = {
    "0": "Error de conexión. Comprueba tu acceso a Internet",
    "401": "Ahora mismo no estás logueado. Accede de nuevo",
    "403": "No tienes permisos para hacer esto",
    "409": "No se pudo realizar la operación. Inténtalo más tarde",
    "412": "Aplicación desactualizada",
    "500": "Ocurrió un error al procesar tu solicitud"
  };

constructor(private snackBar:MatSnackBar) { 

}

showMessage(message: string, action: string = undefined) {
  this.snackBar.open(message, action, {
    duration: 4000,
  });
}

getErrorMessageForStatus(error) {
  let message: string = this.errorMap["500"];
  if(error["name"] === "TimeoutError") 
    message = this.errorMap["0"];
  else if (error.customMessage)
    message = error.message || this.errorMap["500"];
  else if (error instanceof HttpErrorResponse) {
    if (error.error instanceof Error) {
      message = this.errorMap["0"];
    } else {
      message = this.errorMap[error.status.toString()] || this.errorMap["500"];
    }
  }
  this.showMessage(message);
}

}
