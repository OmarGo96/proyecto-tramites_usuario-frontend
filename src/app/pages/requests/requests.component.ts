import {Component, OnInit, ViewChild} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MessageService} from "../../services/messages.service";

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {


    public dataSource: any;
    public displayedColumns: string[] = ['folio', 'tramite', 'creado', 'estatus', 'accion'];
    public expandedElement: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    /* Banderas */
    public loading = false;

    constructor(
        private requestService: RequestService,
        private messagesService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.getSolicitudes();
    }

    getSolicitudes(){
        this.requestService.getRecords().subscribe({
            next: res => {
                this.dataSource = new MatTableDataSource(res.solicitudes);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
