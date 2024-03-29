import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";
import {NgxSpinnerService} from "ngx-spinner";
import * as moment from 'moment/moment';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public loginForm: any;
    public token: any;
    public identity: any;

    /* Banderas */
    public loading = false;

    public currentYear = moment().format('YYYY')

    public firstLogin = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private usersService: UsersService,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.isFirstLogin();
        this.initLoginForm()
    }

    isFirstLogin(){
        this.activatedRoute.params.subscribe(params => {
            if (params['first'] === '1'){
                this.firstLogin = true;
            }
        });
    }

    initLoginForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    onLogin() {
        this.spinner.show();
        const data = this.loginForm.value;
        this.usersService.login(data).subscribe({
            next: res => {
                sessionStorage.setItem('token', res.token);
                this.getIdentity(res.token);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        });
    }

    getIdentity(token: any) {
        this.usersService.getContribuyente(token).subscribe({
            next: res => {
                this.spinner.hide();
                sessionStorage.setItem('identity', JSON.stringify(res.contribuyente));
                this.router.navigate(['escritorio']);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        });
    }
}
