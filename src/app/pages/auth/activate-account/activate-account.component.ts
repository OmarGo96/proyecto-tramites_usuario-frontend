import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {MessageService} from "../../../services/messages.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-activate-account',
    templateUrl: './activate-account.component.html',
    styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {

    public activateAccountForm: any;

    public loading = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private usersService: UsersService,
        private messagesService: MessageService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.getCodigoActivacion();
    }

    getCodigoActivacion() {
        this.activatedRoute.params.subscribe(params => {
            this.activateAccount(params['codigo']);
        });
    }

    activateAccount(code: any) {
        this.loading = true;
        this.usersService.activarCuenta(code).subscribe({
            next: res => {
                this.messagesService.printStatus('Se ha activado su correo de manera correcta.', 'success');
                this.router.navigate(['login'])
            },
            error: err => {
                this.loading = false;
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        });
    }

}
