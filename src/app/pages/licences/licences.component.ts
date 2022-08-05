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

@Component({
    selector: 'app-licences',
    templateUrl: './licences.component.html',
    styleUrls: ['./licences.component.css']
})
export class LicencesComponent implements OnInit {

    public licenceForm: any;

    public dataSource: any;
    public displayedColumns: string[] = ['licencia', 'rfc', 'estado_cuenta', 'accion'];
    public expandedElement: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    /* Banderas */
    public creating = false;
    public loading = false;

    constructor(
        private licfuncService: LicfuncService,
        private messagesService: MessageService,
        private formBuilder: UntypedFormBuilder,
        public dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.initLicenceForm();
        this.getLicences();
    }

    initLicenceForm() {
        this.licenceForm = this.formBuilder.group({
            licencia: ['', Validators.required]
        });
    }

    getLicences() {
        this.licfuncService.getRecords().subscribe({
                next: res => {
                    this.dataSource = new MatTableDataSource(res.licencias);
                },
                error: err => {
                    this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                }
            }
        );
    }

    createLicence(){
        this.creating = true;
        const data = this.licenceForm.value;
        this.licfuncService.createRecords(data).subscribe({
            next: res => {
                this.creating = false;
                this.licenceForm.reset();
                this.messagesService.printStatus(res.message, 'success')
                setTimeout(() => {
                    this.getLicences();
                }, 2500);
            },
            error: err => {
                this.creating = false;
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    getEstadoCuenta(licencia: any): void {
        this.loading = true;
        const data = {licencia: licencia.toString()};
        this.licfuncService.getEstadoCuenta(data).subscribe({
            next: res => {
                this.loading = false;
                this.openDialog(res, licencia);
            },
            error: err => {
                this.loading = false;
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
