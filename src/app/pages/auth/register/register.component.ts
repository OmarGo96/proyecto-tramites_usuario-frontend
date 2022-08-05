import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UntypedFormBuilder, Validators} from "@angular/forms";

/* Services */
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public registerForm: any;
    public loading = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private usersService: UsersService,
        private messagesService: MessageService,
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
            telefono_referencia: ['', Validators.required],
            genero: ['', Validators.required]
        })
    }

    onRegister(){
        this.loading = true;
        const data = this.registerForm.value;
        console.log(data);
        this.usersService.register(data).subscribe({
            next: res => {
                this.loading = false;
                this.registerForm.reset();
                this.router.navigate(['login']);
            },
            error: err => {
                this.loading = false;
                this.messagesService.printStatus(err.error.errors[0].message, 'warning');
            },
            complete: () => {
                console.log('Se completo el registro.')
            }
        })
    }

}
