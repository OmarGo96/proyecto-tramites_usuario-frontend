import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {PredialService} from "../../../services/predial.service";
import {UsersService} from "../../../services/users.service";
import {MatTableDataSource} from "@angular/material/table";
import {MessageService} from "../../../services/messages.service";
import {LicfuncService} from "../../../services/licfunc.service";

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
        private licfuncService: LicfuncService,
        private messagesService: MessageService,
        private usersService: UsersService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.data.content.estado_cuenta);
        this.clave = this.data.clave;
        console.log(this.clave);
    }

    getTotalCost() {
        return this.dataSource.data.map((element: any) => element.proImporte).reduce((acc: any, value: any) => acc + value, 0);
    }

    generarPaseCaja() {
        this.caja = true;
        let data = {'clave': this.clave};
        this.predialService.generarPaseCaja(data).subscribe({
            next: res => {
                this.caja = false;
                window.open(res.link, '_blank');
                setTimeout(() => {
                    this.dialog.closeAll();
                }, 1000);
            },
            error: err => {
                this.caja = false;
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        });
    }

    // Generar pase de caja del contribuyente
    realizarPago() {
        this.pago = true;
        var total = this.dataSource.data.map((element: any) => element.proImporte).reduce((acc: any, value: any) => acc + value, 0);
        let data = {
            'clave': this.clave,
            'total': total.toString()
        };
        this.predialService.realizarPago(data).subscribe(
            res => {
                this.pago = false;
                window.open(res.link, '_blank');
                setTimeout(() => {
                    this.dialog.closeAll();
                }, 1000);
            },
            err => {
                this.pago = false;
                this.messagesService.printStatus(err.error.errors[0].message, 'error');
            }
        );
    }

    generatePaymentPass(): void {
        this.caja = true;
        const data = {licencia: this.clave.toString()};
        console.log(data);
        this.licfuncService.generarPaseCaja(data).subscribe({
            next: res => {
                this.caja = false;
                window.open(res.pase_caja, '_blank');
                setTimeout(() => {
                    this.dialog.closeAll();
                }, 1000);
            },
            error: err => {
                this.caja = false;
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        });
    }

    // Generar pase de caja del contribuyente
    makePayment(): void {
        this.pago = true;
        const total: any = this.dataSource.data.map((element: any) => element.proImporte).reduce((acc: any, value: any) => acc + value, 0);
        const data = {
            licencia: this.clave.toString()
        };
        this.licfuncService.realizarPago(data).subscribe({
            next: res => {
                this.pago = false;
                window.open(res.link, '_blank');
                setTimeout(() => {
                    this.dialog.closeAll();
                }, 1000);
            },
            error: err => {
                this.pago = false;
                this.messagesService.printStatus(err.error.errors[0].message, 'error');
            }
        });
    }

}
