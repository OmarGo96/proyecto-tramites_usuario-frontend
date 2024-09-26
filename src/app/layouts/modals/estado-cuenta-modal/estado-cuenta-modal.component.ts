import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {PredialService} from "../../../services/predial.service";
import {UsersService} from "../../../services/users.service";
import {MatTableDataSource} from "@angular/material/table";
import {MessageService} from "../../../services/messages.service";
import {LicfuncService} from "../../../services/licfunc.service";
import {NgxSpinnerService} from "ngx-spinner";
import Swal from "sweetalert2";
import {RequestService} from "../../../services/request.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-estado-cuenta-modal',
    templateUrl: './estado-cuenta-modal.component.html',
    styleUrls: ['./estado-cuenta-modal.component.css']
})
export class EstadoCuentaModalComponent implements OnInit {

    public dataSource: any;
    public displayedColumns: string[] = ['concepto', 'ejercicio', 'costo'];

    public clave: any;

    /* Banderas */
    public caja = false;
    public pago = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private predialService: PredialService,
        private requestsService: RequestService,
        private licfuncService: LicfuncService,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService,
        public dialog: MatDialog,
        private router: Router,
    ) {
    }

    ngOnInit(): void {

        this.dataSource = new MatTableDataSource(this.data.content.estado_cuenta);
        this.clave = this.data.clave;

    }

    getTotalCost() {
        return this.dataSource.data.map((element: any) => element.proImporte).reduce((acc: any, value: any) => acc + value, 0);
    }

    createRequest(uuid: any) {
        let servicioUuid = uuid;
        let data = {
            servicio_uuid: servicioUuid,
            clave: this.data.clave.id
        };

        Swal.fire({
            title: '¿Estás seguro de iniciar este trámite?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#264395',
            cancelButtonColor: '#a2a2a2',
            confirmButtonText: 'Si, iniciar trámite',
            heightAuto: false
        }).then((result) => {
            if (result.isConfirmed) {
                this.requestsService.createPredialRequest(data).subscribe({
                    next: res => {
                        this.messagesService.printStatus(res.message, 'success')
                        setTimeout(() => {
                            this.router.navigate(['escritorio/solicitud', res.solicitud_id]);
                        }, 2500);
                    },
                    error: err => {
                        this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                    }
                });
            }
        })
    }

    generarPaseCaja() {
        this.spinner.show();
        let data = {'clave': this.clave};
        this.predialService.generarPaseCaja(data).subscribe({
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
        });
    }

    // Generar pase de caja del contribuyente
    realizarPago() {
        this.spinner.show();
        var total = this.dataSource.data.map((element: any) => element.proImporte).reduce((acc: any, value: any) => acc + value, 0);
        let data = {
            'clave': this.clave,
            'total': total.toString()
        };
        this.predialService.realizarPago(data).subscribe(
            res => {
                this.spinner.hide();
                window.open(res.link, '_blank');
                setTimeout(() => {
                    this.dialog.closeAll();
                }, 1000);
            },
            err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        );
    }

    generatePaymentPass(): void {
        this.spinner.show();
        const data = {licencia: this.clave.toString()};
        this.licfuncService.generarPaseCaja(data).subscribe({
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
        });
    }

    // Generar pase de caja del contribuyente
    makePayment(): void {
        this.spinner.show();
        const total: any = this.dataSource.data.map((element: any) => element.proImporte).reduce((acc: any, value: any) => acc + value, 0);
        const data = {
            licencia: this.clave.toString()
        };
        this.licfuncService.realizarPago(data).subscribe({
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
        });
    }

}
