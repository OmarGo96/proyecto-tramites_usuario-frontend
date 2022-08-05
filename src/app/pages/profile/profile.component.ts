import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder} from "@angular/forms";
import {UsersService} from "../../services/users.service";
import {MessageService} from "../../services/messages.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    public userForm: any;
    public passwordForm: any;

    public user: any;

    /* Banderas */
    public userSaving = false;
    public passwordSaving = false;
    public droping = false;

    constructor(
        private usersService: UsersService,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService,
        private formBuilder: UntypedFormBuilder,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.getUser();
    }

    getUser(){
        const token = this.usersService.getToken();
        this.usersService.getContribuyente(token).subscribe({
            next: res => {
                sessionStorage.setItem('identity', JSON.stringify(res.contribuyente));
                this.user = res.contribuyente;
                this.initUserForm();
            },
            error: err => {
                console.log(err);
            }
        });
    }

    initUserForm(){
        this.userForm = this.formBuilder.group({
            nombre:  this.user.nombre,
            apellidos: this.user.apellidos,
            email: this.user.email,
            telefono: this.user.telefono,
            password: [''],
            re_password: ['']
        });
    }

    updateUser(){
        this.spinner.show();
        this.userSaving = true;
        const uuid = this.user.uuid
        const data = this.userForm.value;
        this.usersService.updateRecord(uuid, data).subscribe({
            next: res => {
                this.userSaving = false;
                this.messagesService.printStatus(res.message, 'success');
                this.getUser();
            },
            error: err => {
                this.userSaving = false;
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        })
    }

    updatePassword(){
        this.passwordSaving = true;
        const uuid = this.user.uuid
        const data = this.userForm.value;
        this.usersService.updateRecord(uuid, data).subscribe({
            next: res => {
                this.passwordSaving = false;
                this.messagesService.printStatus(res.message, 'success');
                this.getUser();
            },
            error: err => {
                this.passwordSaving = false;
                this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
            }
        })
    }

    dropUser(){
        const uuid = this.user.uuid
        this.messagesService.confirmRemove().then((res: any) => {
            if (res.isConfirmed){
                this.usersService.deleteRecord(uuid).subscribe({
                    next: res => {
                        this.messagesService.printStatus(res.message, 'success');
                        setTimeout(() => {
                            sessionStorage.removeItem('token');
                            sessionStorage.removeItem('identity');
                            this.router.navigate([''])
                        }, 2500);
                    },
                    error: err => {
                        this.messagesService.printStatusArrayNew(err.error.errors, 'warning');
                    }
                });
            }
        });
    }

}
