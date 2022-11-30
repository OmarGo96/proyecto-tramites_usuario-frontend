import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    public resetPasswordForm: any;

    public loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService
    ) {
    }

    ngOnInit(): void {
        this.initResetForm();
    }

    initResetForm () {
        this.resetPasswordForm = this.formBuilder.group({
            email: ['', Validators.required]
        });
    }

    sendRequest(){
        this.spinner.show();
        const data = this.resetPasswordForm.value;
        this.usersService.requestRestorePassword(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        })
    }

}
