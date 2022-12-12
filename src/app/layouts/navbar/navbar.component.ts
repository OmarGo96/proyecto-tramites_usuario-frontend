import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SearcherModalComponent} from "../modals/searcher-modal/searcher-modal.component";
import {Dialog} from "@angular/cdk/dialog";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    constructor(
        private router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
    }

    logout(){
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('identity');
        this.router.navigate(['']);
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

}
