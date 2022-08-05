import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";


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

    constructor(
        private formBuilder: UntypedFormBuilder,
        private usersService: UsersService,
        private messagesService: MessageService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.initLoginForm()
    }

    initLoginForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    onLogin() {
        this.loading = true;
        const data = this.loginForm.value;
        this.usersService.login(data).subscribe({
            next: res => {
                sessionStorage.setItem('token', res.token);
                this.getIdentity(res.token);
            },
            error: err => {
                this.loading = false;
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        });
    }

    getIdentity(token: any) {
        this.usersService.getContribuyente(token).subscribe({
            next: res => {
                this.loading = false;
                sessionStorage.setItem('identity', JSON.stringify(res.contribuyente));
                this.router.navigate(['escritorio']);
            },
            error: err => {
                this.loading = false;
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        });
    }

}
