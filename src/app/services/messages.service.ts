import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class MessageService {

    public message: any;
    public status: any;
    public deletePopOup: any;

    printStatus(message: any, status: string, mailed?: boolean) {
        this.message = message;
        this.status = status;

        if (this.status === 'success') {
            Swal.fire({
                html: '' + this.message,
                icon: this.status,
                showConfirmButton: false,
                timer: mailed ? 4000 : 2500,
                heightAuto: false
            });

        } else if (this.status === 'error') {
            Swal.fire({
                html: '' + this.message,
                icon: this.status,
                timer: 5000,
                heightAuto: false
            });
        } else if (this.status === 'warning') {
            Swal.fire({
                html: '' + this.message,
                icon: this.status,
                timer: 4000,
                heightAuto: false
            });
        }
    }

    printStatusArray(message: [], status: any, mailed?: any) {
        console.log(message);
        let msg;
        for (let i = 0; i < message.length; i++) {
            msg = message[i] + '<br>';
        }
        this.status = status;

        if (this.status === 'success') {
            Swal.fire({
                html: '' + msg,
                icon: this.status,
                showConfirmButton: false,
                timer: mailed ? 4000 : 2500,
                heightAuto: false
            });

        } else if (this.status === 'error') {
            Swal.fire({
                html: '' + msg,
                icon: this.status,
                timer: 5000,
                heightAuto: false
            });
        } else if (this.status === 'warning') {
            Swal.fire({
                html: '' + msg,
                icon: this.status,
                timer: 4000,
                heightAuto: false
            });
        }
    }

    printStatusArrayNew(errors: [], status: any, mailed?: any) {
        console.log(errors);
        let msg;

        errors.forEach((error: any, index) => {
            if (index === 0) {
                msg = error.message;
            }
        });

        this.status = status;

        if (this.status === 'success') {
            Swal.fire({
                html: '' + msg,
                icon: this.status,
                showConfirmButton: false,
                timer: mailed ? 4000 : 2500,
                heightAuto: false
            });

        } else if (this.status === 'error') {
            Swal.fire({
                html: '' + msg,
                icon: this.status,
                heightAuto: false
            });
        } else if (this.status === 'warning') {
            Swal.fire({
                html: '' + msg,
                icon: this.status,
                timer: 4000,
                heightAuto: false
            });
        }
    }

    confirmRequest(msg?: any, confirmBtnText?: any, cancelBtnText?: any) {
        this.deletePopOup = Swal.fire({
            title: msg ? msg : 'Are you sure to proceed ?',
            icon: 'warning',
            showCancelButton: true,
            focusCancel: true,
            confirmButtonText: confirmBtnText ? confirmBtnText : 'Yes',
            cancelButtonText: cancelBtnText ? cancelBtnText : 'Discard',
            confirmButtonColor: '#1d7a18'
        });
        return this.deletePopOup;
    }

    confirmRemove() {
        this.deletePopOup = Swal.fire({
            title: '¿Estas seguro de eliminar tu cuenta?',
            text: 'Esta acción no se puede revertir',
            icon: 'warning',
            showCancelButton: true,
            focusCancel: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ce3600'
        });
        return this.deletePopOup;
    }

    dismissRemove() {
        this.deletePopOup = Swal.fire({
            title: 'Canceled',
            text: 'Your information is safe :), action canceled',
            icon: 'info',
            timer: 1000
        });
        return this.deletePopOup;
    }


    dismissAction() {
        this.deletePopOup = Swal.fire({
            title: 'Canceled',
            text: 'Action canceled',
            icon: 'info',
            timer: 1000
        });
        return this.deletePopOup;
    }

    // Función para preguntar al usuario si desea continuar con la eliminación de un elemento
    confirmDelete(message: any) {
        this.deletePopOup = Swal.fire({
            title: message,
            text: 'Esta acción no se puede cancelar',
            icon: 'warning',
            showCancelButton: true,
            focusCancel: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#b20909'
        });
        return this.deletePopOup;
    }

    // Función para mostrar mensaje de cancelación de acción
    dismissDelete() {
        this.deletePopOup = Swal.fire({
            title: 'Action Cancel',
            text: 'No changes applied',
            icon: 'info',
            timer: 1500
        });
        return this.deletePopOup;
    }

    // endregion
    constructor() {
    }
}
