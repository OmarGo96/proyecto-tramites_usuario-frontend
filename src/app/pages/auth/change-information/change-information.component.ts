import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, UntypedFormBuilder, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";

@Component({
    selector: 'app-change-information',
    templateUrl: './change-information.component.html',
    styleUrls: ['./change-information.component.css']
})
export class ChangeInformationComponent implements OnInit {

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

    public indentity: any;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.indentity = this.usersService.getIdentity();
        this.initRegisterForm();
    }

    initRegisterForm() {
        this.registerForm = this.formBuilder.group({
            nombre: ['', Validators.required],
            apellidos: [''],
            representante_legal: [''],
            rfc: ['', Validators.required],
            tipo_persona: ['1', Validators.required],
            aviso_privacidad: ['', Validators.required],
            terms_conditions: ['', Validators.required],
        })
    }

    changeInformation() {
        this.spinner.show();
        const data = this.registerForm.value;
        this.usersService.changeInformation(this.indentity.uuid, data).subscribe({
            next: res => {
                this.messagesService.printStatus(res.message, 'success');
                this.registerForm.reset();
                this.router.navigate(['escritorio']);
                this.spinner.hide();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        })
    }

    checkPersonType(event: any){
        this.personType = event.value;
    }


    get password(): AbstractControl {
        return this.registerForm.get('password');
    }

}
