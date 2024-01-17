import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AbstractControl, UntypedFormBuilder, Validators} from "@angular/forms";

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

    public lowerLetters: any;
    public upperLetters: any;
    public numbers: any;
    public symbols: any;
    public length: any;

    hide = true;

    public personType = '1';

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

    initRegisterForm() {
        this.registerForm = this.formBuilder.group({
            nombre: ['', Validators.required],
            apellidos: [''],
            representante_legal: [''],
            email: ['', Validators.required],
            re_email: ['', Validators.required],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(
                    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/
                ),
            ]],
            re_password: ['', Validators.required],
            edad: ['', Validators.required],
            telefono: ['', Validators.required],
            rfc: ['', Validators.required],
            genero: ['', Validators.required],
            tipo_persona: ['1', Validators.required],
            aviso_privacidad: ['', Validators.required],
            terms_conditions: ['', Validators.required],
            recaptcha: ['', Validators.required]
        })
    }

    onRegister() {
        this.spinner.show();
        const data = this.registerForm.value;
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

    checkPersonType(event: any){
        this.personType = event.value;
        console.log(this.personType);
    }

    checkStrength(event: any): void {
        const password = event.target.value;


        // 2
        this.lowerLetters = /[a-z]+/.test(password) ? true : false;
        this.upperLetters = /[A-Z]+/.test(password) ? true : false;
        this.numbers = /[0-9]+/.test(password) ? true : false;
        this.symbols = /[$-/:-?{-~!"^_#@`\[\]]/g.test(password) ? true : false;
        this.length = password.length >= 8 ? true : false;

    }

    get password(): AbstractControl {
        return this.registerForm.get('password');
    }

}
