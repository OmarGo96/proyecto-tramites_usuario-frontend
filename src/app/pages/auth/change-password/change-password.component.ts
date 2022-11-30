import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    public resetPasswordForm: any;
    public codigo: any;

    public loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private activatedRouter: ActivatedRoute,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.initResetForm();
        this.getCodigo();
    }

    initResetForm() {
        this.resetPasswordForm = this.formBuilder.group({
            password: ['', Validators.required],
            re_password: ['', Validators.required]
        });
    }

    getCodigo() {
        this.activatedRouter.params.subscribe(params => {
            this.codigo = params['codigo'];
        });
    }

    resetPasword() {
        this.spinner.show();
        const data = this.resetPasswordForm.value;
        data.codigo = this.codigo;
        this.usersService.restorePassword(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
                this.router.navigate(['login']);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        });
    }
}
