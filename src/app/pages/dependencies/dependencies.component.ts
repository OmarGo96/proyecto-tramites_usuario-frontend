import {Component, OnInit} from '@angular/core';
import {DependenciesService} from 'src/app/services/dependencies.service';
import {MessageService} from 'src/app/services/messages.service';
import {EstadoCuentaModalComponent} from "../../layouts/modals/estado-cuenta-modal/estado-cuenta-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {SearcherModalComponent} from "../../layouts/modals/searcher-modal/searcher-modal.component";

@Component({
    selector: 'app-dependencies',
    templateUrl: './dependencies.component.html',
    styleUrls: ['./dependencies.component.css']
})
export class DependenciesComponent implements OnInit {

    public dependencies: any;

    constructor(
        private dependenciesService: DependenciesService,
        private dialog: MatDialog,
        private messagesService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.getAreas();
    }

    getAreas() {
        this.dependenciesService.getRecords().subscribe({
            next: res => {
                this.dependencies = res.areas;
                console.log(this.dependencies);
            },
            error: err => {
                console.log(err);
                // this.messagesService.printStatus(err.error.errors, 'error');
            }
        })
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
