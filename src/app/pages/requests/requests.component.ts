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
import {PredialService} from "../../services/predial.service";
import Swal from "sweetalert2";

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
        private predialService: PredialService,
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
        Swal.fire({
            title: 'Sistema en mantenimiento',
            text: 'El sistema de pagos se encuentra en mantenimiento. Por favor, intente más tarde.',
            icon: 'warning',
            confirmButtonColor: '#264395',
            confirmButtonText: 'Entendido',
            heightAuto: false
        });
    }

    paymentLink(solicitud: any) {
        Swal.fire({
            title: 'Sistema en mantenimiento',
            text: 'El sistema de pagos se encuentra en mantenimiento. Por favor, intente más tarde.',
            icon: 'warning',
            confirmButtonColor: '#264395',
            confirmButtonText: 'Entendido',
            heightAuto: false
        });
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
