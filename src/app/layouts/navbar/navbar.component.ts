import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SearcherModalComponent} from "../modals/searcher-modal/searcher-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {ChangePasswordModalComponent} from "../modals/change-password-modal/change-password-modal.component";
import {UsersService} from "../../services/users.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    public contribuyente: any;

    constructor(
        private contribuyentesService: UsersService,
        private router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        const identity: any = sessionStorage.getItem('identity');
        this.contribuyente = JSON.parse(identity);
    }

    openChangePasswordModal(){
        const config = {
            width: '30%',
            data: {
                contribuyente: this.contribuyente
            }
        }

        const dialogRef = this.dialog.open(ChangePasswordModalComponent, config);

        dialogRef.afterClosed().subscribe(res => {
            // this.getContribuyentes();
        });
    }

    activeSearchModal(){
        const config = {
            width: '50%',
            height: '50%'
        };

        const dialogRef = this.dialog.open(SearcherModalComponent, config);

        dialogRef.afterClosed().subscribe(() => {
            // this.getClaves();
        });
    }

    logout(): void {
        this.contribuyentesService.logout();
    }


}
