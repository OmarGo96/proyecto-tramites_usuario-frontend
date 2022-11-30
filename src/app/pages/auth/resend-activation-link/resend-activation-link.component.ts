import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-resend-activation-link',
    templateUrl: './resend-activation-link.component.html',
    styleUrls: ['./resend-activation-link.component.css']
})
export class ResendActivationLinkComponent implements OnInit {

    public resendForm: any;

    public loading = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private usersService: UsersService,
        private messagesService: MessageService,
        private activatedRoute: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.initResendForm();
    }

    initResendForm(){
        this.resendForm = this.formBuilder.group({
            email: ['', Validators.required]
        })
    }

    sendEmail(){
        this.spinner.show();
        const data = this.resendForm.value;
        this.usersService.resendActivationLink(data).subscribe({
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
