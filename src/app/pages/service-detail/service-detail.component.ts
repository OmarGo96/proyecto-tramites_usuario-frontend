import {Component, OnInit} from '@angular/core';
import {RequirementsService} from "../../services/requirements.service";
import {RequestService} from "../../services/request.service";
import {ServicesService} from "../../services/services.service";
import {DocumentsService} from "../../services/documents.service";
import {MessageService} from "../../services/messages.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-service-detail',
    templateUrl: './service-detail.component.html',
    styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {

    public service: any;
    public document: any;
    public serviceUuid: any;

    public dataSource: any;
    public displayedColumns: string[] = ['nombre', 'original', 'copias', 'complementario', 'obligatorio'];

    constructor(
        private requirementsService: RequirementsService,
        private requestsService: RequestService,
        private servicesService: ServicesService,
        private documentsService: DocumentsService,
        private messagesService: MessageService,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.getUuid();
    }

    getUuid() {
        this.activatedRoute.params.subscribe({
            next: res => {
                this.getService(res['uuid']);
                this.serviceUuid = res['uuid'];
            },
            error: err => {
                console.log(err);
            }
        });
    }

    getService(uuid: any) {
        this.servicesService.getRecord(uuid).subscribe({
            next: res => {
                this.service = res.servicio;
                this.getRequirements();
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    getRequirements() {
        const serviceUuid = this.service.uuid;
        this.requirementsService.getRecords(serviceUuid).subscribe({
            next: res => {
                this.dataSource = new MatTableDataSource(res.requerimientos);
                // this.dataSource.paginator = this.paginator;
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    getDocument() {
        const serviceUuid = this.service.uuid;
        this.documentsService.getDocument(serviceUuid).subscribe({
            next: res => {
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }
}
