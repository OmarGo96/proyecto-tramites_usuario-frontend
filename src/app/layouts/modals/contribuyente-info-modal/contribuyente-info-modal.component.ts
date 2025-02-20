import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RequestService} from "../../../services/request.service";
import {MessageService} from "../../../services/messages.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-contribuyente-info-modal',
    templateUrl: './contribuyente-info-modal.component.html',
    styleUrls: ['./contribuyente-info-modal.component.css']
})
export class ContribuyenteInfoModalComponent implements OnInit {
    public contribuyenteForm: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private requestsService: RequestService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private messagesService: MessageService,
        private router: Router,
        public dialogRef: MatDialogRef<any>,

    ) {
    }

    ngOnInit(): void {
        this.initContribuyenteForm()
    }

    initContribuyenteForm(){
        this.contribuyenteForm = this.formBuilder.group({
            expediente_id: this.data.expediente_id,
            clave_catastral: [''],
            correo: [''],
            nombre_gestor: [''],
            representante_legal: [''],
            telefono_contacto: ['']
        });
    }

    addExpedienteInfo(){
        this.spinner.show();
        const data = this.contribuyenteForm.value;
        this.requestsService.addExpedienteInfo(data).subscribe({
            next: res => {
                this.createRequest();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    createRequest() {
        let servicioUuid = this.data.serviceUuid;
        let data = {
            servicio_uuid: servicioUuid,
            expediente_id: this.contribuyenteForm.value.expediente_id
        };
        this.requestsService.createRecords(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success')
                setTimeout(() => {
                    this.router.navigate(['escritorio/solicitud', res.solicitud_id]);
                    this.dialogRef.close();
                }, 2500);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

}
