import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "../../../services/messages.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-change-password-modal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {

    public resetPasswordForm: any;
    public contribuyente: any;
    public hide = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private contribuyentesService: UsersService,
        private spinner: NgxSpinnerService,
        private messagesService: MessageService,
        private snackBar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.contribuyente = this.data.contribuyente;
        this.initPasswordForm();
    }

    initPasswordForm() {
        this.resetPasswordForm = this.formBuilder.group({
            password: ['', Validators.required],
            re_password: ['', Validators.required]
        });
    }

    resetPasword() {
        this.spinner.show();
        const data = this.resetPasswordForm.value;
        this.contribuyentesService.changePassword(this.contribuyente.uuid, data).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        });
    }

    generatePassword(length: number = 16): void {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        const allChars = uppercase + lowercase + numbers + symbols;

        // Al menos un carácter de cada tipo
        let password = [
            uppercase[Math.floor(Math.random() * uppercase.length)],
            lowercase[Math.floor(Math.random() * lowercase.length)],
            numbers[Math.floor(Math.random() * numbers.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        // Completar el resto de la contraseña
        for (let i = password.length; i < length; i++) {
            password.push(allChars[Math.floor(Math.random() * allChars.length)]);
        }

        // Mezclar el array
        for (let i = password.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [password[i], password[j]] = [password[j], password[i]];
        }

        const generatedPassword = password.join('');

        // Actualizar ambos campos del formulario
        this.resetPasswordForm.patchValue({
            password: generatedPassword,
            re_password: generatedPassword
        });
    }

    copyPassword(): void {
        const password = this.resetPasswordForm.get('password')?.value;

        if (password) {
            navigator.clipboard.writeText(password).then(() => {
                this.snackBar.open('Contraseña copiada', 'Cerrar', { duration: 2000 });
            });
        }
    }

}
