import {Component, OnInit, ViewChild} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MessageService} from "../../services/messages.service";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {RequestsStatus} from "../../const/status";
import {LicfuncService} from "../../services/licfunc.service";

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {


    public dataSource: any;
    public displayedColumns: string[] = ['folio', 'servicio', 'licencia', 'area', 'contribuyente', 'creado', 'estatus', 'pago', 'accion'];
    public expandedElement: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    public statuses = RequestsStatus;

    /* Banderas */
    public loading = false;

    constructor(
        private requestService: RequestService,
        private messagesService: MessageService,
        private licFuncService: LicfuncService,
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
                console.log(res.solicitudes);
                this.spinner.hide();
                this.dataSource = new MatTableDataSource(res.solicitudes);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.errorAlert(err.error.errors);
            }
        })
    }

    generateCheckout(solicitud: any) {
        this.spinner.show();
        if (solicitud.Servicio.id === 7) {
            const data = {licencia: solicitud.licencia_id.toString()};
            this.licFuncService.generarPaseCaja(data).subscribe({
                next: res => {
                    this.spinner.hide();
                    window.open(res.pase_caja, '_blank');
                    setTimeout(() => {
                        this.dialog.closeAll();
                    }, 1000);
                },
                error: err => {
                    this.spinner.hide();
                    this.messagesService.errorAlert(err.error.errors);
                }
            });
        } else if([15, 21, 22, 5, 13, 24, 11, 2, 3].includes(solicitud.Servicio.id)){
            this.requestService.obtenerPaseCaja(solicitud.id).subscribe({
                next: res => {
                    this.spinner.hide();
                    let url = URL.createObjectURL(res);
                    window.open(url, '_blank');
                },
                error: err => {
                    this.spinner.hide();
                    this.messagesService.errorAlert([{message: 'Ocurrio un problema al obtener el PDF. Intentalo más tarde.'}]);
                }
            });
        } else {
            const data = {
                solicitud_id: solicitud.id.toString(),
                grupo_tramite_id: solicitud.Servicio.grupo_tramite_id.toString(),
                tramite_id: solicitud.Servicio.tramite_id.toString(),
                importe: '2500'
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
                    this.messagesService.errorAlert(err.error.errors);
                }
            });
        }

    }

    paymentLink(solicitud: any) {
        this.spinner.show();
        if (solicitud.Servicio.id === 7){
            const data = {licencia: solicitud.licencia_id.toString() };
            this.licFuncService.realizarPago(data).subscribe({
                next: res => {
                    this.spinner.hide();
                    window.open(res.link, '_blank');
                },
                error: err => {
                    this.spinner.hide();
                    this.messagesService.errorAlert(err.error.errors);
                }
            });
        } else {
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
                },
                error: err => {
                    this.spinner.hide();
                    this.messagesService.errorAlert(err.error.errors);
                }
            })
        }

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
                        estatus_solicitud_id: '13'
                    };
                    this.requestService.updateRecord(data, solicitudId.toString()).subscribe({
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
