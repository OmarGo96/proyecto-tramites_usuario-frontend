import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {LicfuncService} from "../../../services/licfunc.service";
import {MessageService} from "../../../services/messages.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-add-licenses-modal',
    templateUrl: './add-licenses-modal.component.html',
    styleUrls: ['./add-licenses-modal.component.css']
})
export class AddLicensesModalComponent implements OnInit {

    public licenceForm: any;

    constructor(
        private licfuncService: LicfuncService,
        private messagesService: MessageService,
        private formBuilder: UntypedFormBuilder,
        private spinner: NgxSpinnerService,
        public dialogRef: MatDialogRef<any>
    ) {
    }

    ngOnInit(): void {
        this.initLicenceForm();
    }

    initLicenceForm() {
        this.licenceForm = this.formBuilder.group({
            licencia: ['', Validators.required]
        });
    }

    createLicence(){
        this.spinner.show();
        const data = this.licenceForm.value;
        this.licfuncService.createRecords(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.licenceForm.reset();
                this.messagesService.printStatus(res.message, 'success')
                setTimeout(() => {
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
