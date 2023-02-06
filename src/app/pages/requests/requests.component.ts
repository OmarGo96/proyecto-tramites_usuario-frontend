import {Component, OnInit, ViewChild} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MessageService} from "../../services/messages.service";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {


    public dataSource: any;
    public displayedColumns: string[] = ['folio', 'tramite', 'creado', 'estatus', 'pago', 'accion'];
    public expandedElement: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    /* Banderas */
    public loading = false;

    constructor(
        private requestService: RequestService,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getSolicitudes();
    }

    getSolicitudes() {
        this.spinner.show();
        this.requestService.getRecords().subscribe({
            next: res => {
                this.spinner.hide();
                this.dataSource = new MatTableDataSource(res.solicitudes);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    generateCheckout(solicitud: any) {
        this.spinner.show();
        const data = {
            solicitud_id: solicitud.id.toString(),
            grupo_tramite_id: solicitud.Servicio.grupo_tramite_id.toString(),
            tramite_id: solicitud.Servicio.tramite_id.toString(),
            importe: '1445'
        }

        this.requestService.generateCheckout(data).subscribe({
            next: res => {
                this.spinner.hide();
                window.open(res.pase_caja, '_blank');
                setTimeout(() => {
                    this.dialog.closeAll();
                }, 1000);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    paymentLink(solicitud: any) {
        this.spinner.show();
        const data = {
            solicitud_id: solicitud.id.toString(),
            grupo_tramite_id: solicitud.Servicio.grupo_tramite_id.toString(),
            tramite_id: solicitud.Servicio.tramite_id.toString(),
            importe: '1445'
        }

        this.requestService.paymentLink(data).subscribe({
            next: res => {
                this.spinner.hide();
                window.open(res.link, '_blank');
                setTimeout(() => {
                    this.dialog.closeAll();
                }, 1000);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    deleteRegister(solicitudId: any, statusId: any) {
        this.messagesService.confirmDelete('¿Estás seguro de eliminar esta solicitud?')
            .then((result: any) => {
                console.log(result);
                if (result.isConfirmed) {
                    this.spinner.show();
                    const data = {
                        estatus_solicitud_id: '13',
                        solicitud_id: solicitudId.toString()
                    };
                    this.requestService.updateRecord(data).subscribe({
                        next: res => {
                            this.spinner.hide();
                            this.messagesService.printStatus(res.message, 'success');
                            setTimeout(() => {
                                this.getSolicitudes();
                            }, 2500)
                        },
                        error: err => {
                            this.spinner.hide();
                            this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                        }
                    });
                }
            });

    }
}
