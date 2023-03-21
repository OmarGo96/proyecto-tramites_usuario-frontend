import {Component, Inject, OnInit} from '@angular/core';
import {LicfuncService} from "../../../../services/licfunc.service";
import {MessageService} from "../../../../services/messages.service";
import {FormBuilder, UntypedFormBuilder, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import * as moment from "moment/moment";
import Swal from "sweetalert2";
import {RequestService} from "../../../../services/request.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-validate-before-renew-modal',
    templateUrl: './validate-before-renew-modal.component.html',
    styleUrls: ['./validate-before-renew-modal.component.css']
})
export class ValidateBeforeRenewModalComponent implements OnInit {

    public licenceForm: any;

    public validYears: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private licfuncService: LicfuncService,
        private requestsService: RequestService,
        private messagesService: MessageService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private router: Router,
        public dialogRef: MatDialogRef<any>
    ) {
    }

    ngOnInit(): void {
        this.initLicenceForm();
        this.validYears = this.getYears();
    }

    initLicenceForm() {
        this.licenceForm = this.formBuilder.group({
            licencia: ['', Validators.required],
            folioRenovacion: ['', Validators.required],
            ultimoAnoRenovacion: ['', Validators.required]
        });
    }

    validateLicense() {
        this.spinner.show();
        const data = this.licenceForm.value;
        this.licfuncService.validarLicencia(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.createRequest()
            },
            error: err => {
                console.log(err);
                this.spinner.hide();
                this.messagesService.errorAlert(err.error.errors);
            }
        })
    }

    createRequest() {
        this.spinner.show();
        let servicioUuid = this.data.serviceUuid;
        let data = {
            servicio_uuid: servicioUuid,
            licencia: this.licencia.value
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

    private getYears() {
        const years: any = [];
        const dateStart = moment().subtract(1, 'y');
        const dateEnd = moment().subtract(15, 'y');
        while (dateStart.diff(dateEnd, 'years') >= 0) {
            years.unshift(dateEnd.format('YYYY'));
            dateEnd.add(1, 'year');
        }
        return years;
    }

    get licencia() {
        return this.licenceForm.get("licencia");
    }

}
