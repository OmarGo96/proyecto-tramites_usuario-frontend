import {Component, OnInit, ViewChild} from '@angular/core';
import {MessageService} from "../../services/messages.service";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {LicfuncService} from "../../services/licfunc.service";
import {EstadoCuentaModalComponent} from "../../layouts/modals/estado-cuenta-modal/estado-cuenta-modal.component";
import Swal from "sweetalert2";
import {MatTableDataSource} from "@angular/material/table";
import {LicencesModalComponent} from "../../layouts/modals/licences-modal/licences-modal.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NgxSpinnerService} from "ngx-spinner";
import * as moment from 'moment';
import {AddLicensesModalComponent} from "../../layouts/modals/add-licenses-modal/add-licenses-modal.component";

@Component({
    selector: 'app-licences',
    templateUrl: './licences.component.html',
    styleUrls: ['./licences.component.css']
})
export class LicencesComponent implements OnInit {

    public dataSource: any;
    public displayedColumns: string[] = ['licencia', 'rfc', 'pago'];
    public expandedElement: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    public currentDate: any;

    /* Banderas */
    public creating = false;
    public loading = false;

    constructor(
        private licfuncService: LicfuncService,
        private messagesService: MessageService,
        private formBuilder: UntypedFormBuilder,
        private spinner: NgxSpinnerService,
        public dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.currentDate = moment().format('YYYY')
        this.getLicences();
    }



    getLicences() {
        this.spinner.show();
        this.licfuncService.getRecords().subscribe({
                next: res => {
                    this.spinner.hide();
                    this.dataSource = new MatTableDataSource(res.licencias);
                },
                error: err => {
                    this.spinner.hide();
                    this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                }
            }
        );
    }



    getEstadoCuenta(licencia: any): void {
        this.spinner.show();
        const data = {licencia: licencia.toString()};
        this.licfuncService.getEstadoCuenta(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.openDialog(res, licencia);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    openDialog(estadoCuenta: any, clave?: any) {
        const config = {
            width: '80%',
            data: {
                licencia: true,
                content: estadoCuenta ? estadoCuenta : false,
                clave: clave ? clave : false
            }
        };

        const dialogRef = this.dialog.open(EstadoCuentaModalComponent, config);

        dialogRef.afterClosed().subscribe(() => {
            // this.getClaves();
        });
    }

    openDetailDialog(licencia: any){
        const config = {
            width: '80%',
            data: {
                licencia
            }
        };

        const dialogRef = this.dialog.open(LicencesModalComponent, config);

        dialogRef.afterClosed().subscribe(() => {
            // this.getClaves();
        });
    }

    addNewLicense(): void {
        const config = {
            data: {
                name: 'Juan Amaya'
            },
        }

        const dialogRef = this.dialog.open(AddLicensesModalComponent, config);

        dialogRef.afterClosed().subscribe(result => {
            this.getLicences();
        });
    }

   /* deleteClave(clave: any){
        let data = { 'clave': clave };
        Swal.fire({
            title: '¿Estás seguro de eliminar esta clave catastral?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#005be1',
            cancelButtonColor: '#a2a2a2',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.loading = true;
                this.predialService.deleteClave(data).subscribe(
                    res => {
                        this.loading = false;
                        this.messagesService.printStatus(res.message, 'success')
                        setTimeout(() => {
                            this.getClaves();
                        }, 2500);
                    },
                    err => {
                        this.loading = false;
                        this.messagesService.printStatus(err.error.errors, 'error');
                    }
                )
            }
        });
    }*/

}
