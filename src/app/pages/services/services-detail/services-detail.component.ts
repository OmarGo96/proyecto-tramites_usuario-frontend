import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ServicesService} from 'src/app/services/services.service';
import {MessageService} from 'src/app/services/messages.service';
import {DocumentsService} from 'src/app/services/documents.service';
import {RequirementsService} from 'src/app/services/requirements.service';
import {MatTableDataSource} from "@angular/material/table";
import Swal from "sweetalert2";
import {RequestService} from "../../../services/request.service";
import {MatDialog} from "@angular/material/dialog";


@Component({
    selector: 'app-services-detail',
    templateUrl: './services-detail.component.html',
    styleUrls: ['./services-detail.component.css']
})
export class ServicesDetailComponent implements OnInit {

    public service: any;
    public document: any;
    public serviceUuid: any;

    public dataSource: any;
    public displayedColumns: string[] = ['nombre', 'original', 'copias', 'complementario', 'obligatorio'];

    /* Banderas */
    public loading = false;

    constructor(
        private requirementsService: RequirementsService,
        private requestsService: RequestService,
        private servicesService: ServicesService,
        private documentsService: DocumentsService,
        private messagesService: MessageService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public matDialog: MatDialog
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
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        });
    }

    createRequest(uuid: any) {
        let data = {'servicio_uuid': uuid};
        let servicioUuid = uuid;

        Swal.fire({
            title: '¿Estás seguro de iniciar este trámite?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#264395',
            cancelButtonColor: '#a2a2a2',
            confirmButtonText: 'Si, iniciar trámite'
        }).then((result) => {
            if (result.isConfirmed) {
                this.loading = true;
                this.requestsService.createRecords(data).subscribe({
                    next: res => {
                        this.loading = false;
                        this.messagesService.printStatus(res.message, 'success')
                        setTimeout(()=>{
                            this.router.navigate(['escritorio/solicitud', res.solicitud_id]);
                        }, 2500);
                    },
                    error: err => {
                        this.loading = false;
                        this.messagesService.printStatus(err.error.errors, 'error');
                    }
                });
            }
        })
    }

    getRequirements() {
        const serviceUuid = this.service.uuid;
        this.requirementsService.getRecords(serviceUuid).subscribe({
            next: res => {
                this.dataSource = new MatTableDataSource(res.requerimientos);
                // this.dataSource.paginator = this.paginator;
            },
            error: err => {
                this.messagesService.printStatus(err.error.errors, 'error');
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
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        });
    }

}
