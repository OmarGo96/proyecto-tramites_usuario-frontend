import {Component, Inject, OnInit} from '@angular/core';
import * as moment from "moment";
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RequestService} from "../../../services/request.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "../../../services/messages.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-validate-pao-renew-modal',
    templateUrl: './validate-pao-renew-modal.component.html',
    styleUrls: ['./validate-pao-renew-modal.component.css']
})
export class ValidatePaoRenewModalComponent implements OnInit {

    public validationForm: any;

    public validYears: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private requestsService: RequestService,
        private spinner: NgxSpinnerService,
        private messagesService: MessageService,
        private router: Router,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.initValidationForm();
        this.validYears = this.getYears();
    }

    initValidationForm() {
        this.validationForm = this.formBuilder.group({
            folio: ['', Validators.required],
            ejercicio: ['', Validators.required],
            vigenciaPermiso: ['', Validators.required]
        });
    }

    validatePAO(){
        this.spinner.show();
        const data = {
            folio: this.validationForm.value.folio,
            ejercicio: this.validationForm.value.ejercicio,
            vigenciaPermiso: moment(this.validationForm.value.vigenciaPermiso).format('YYYY-MM-DD'),
        };
        this.requestsService.validatePaoRenew(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.createRequest();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    createRequest() {
        this.spinner.show();
        let servicioUuid = this.data.serviceUuid;
        let data = {'servicio_uuid': servicioUuid};


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

    private getYears() {
        const years: any = [];
        const dateStart = moment();
        const dateEnd = moment().subtract(10, 'y');
        while (dateStart.diff(dateEnd, 'years') >= 0) {
            years.unshift(dateEnd.format('YYYY'));
            dateEnd.add(1, 'year');
        }
        return years;
    }

}
