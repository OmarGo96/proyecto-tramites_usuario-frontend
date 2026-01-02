import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";

@Component({
    selector: 'app-reset-password-clave',
    templateUrl: './reset-password-clave.component.html',
    styleUrls: ['./reset-password-clave.component.css']
})
export class ResetPasswordClaveComponent implements OnInit {

    public resetPasswordForm: any;

    public loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.initResetForm();
    }

    initResetForm () {
        this.resetPasswordForm = this.formBuilder.group({
            email: ['', Validators.required],
            clave_catastral: ['', Validators.required]
        });
    }

    sendRequest(){
        this.spinner.show();
        const data = this.resetPasswordForm.value;
        this.usersService.requestRestorePasswordClave(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
                this.router.navigate(['restablecer', res.codigo]);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        })
    }

}
