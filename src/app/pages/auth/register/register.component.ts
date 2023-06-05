import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UntypedFormBuilder, Validators} from "@angular/forms";

/* Services */
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public registerForm: any;
    public loading = false;
    public token: any;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private usersService: UsersService,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.initRegisterForm();
    }

    initRegisterForm(){
        this.registerForm = this.formBuilder.group({
            nombre: ['', Validators.required],
            apellidos: ['', Validators.required],
            email: ['', Validators.required],
            re_email: ['', Validators.required],
            password: ['', Validators.required],
            re_password: ['', Validators.required],
            edad: ['', Validators.required],
            telefono: ['', Validators.required],
            rfc: ['', Validators.required],
            genero: ['', Validators.required],
            aviso_privacidad: [1, Validators.required],
            recaptcha: ['', Validators.required]
        })
    }

    onRegister(){
        this.spinner.show();
        const data = this.registerForm.value;
        console.log(data);
        this.usersService.register(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.registerForm.reset();
                this.router.navigate(['login', 1]);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        })
    }

}
