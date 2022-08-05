import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {MessageService} from "../../services/messages.service";
import {PredialService} from "../../services/predial.service";
import {MatTableDataSource} from "@angular/material/table";
import {EstadoCuentaModalComponent} from "../../layouts/modals/estado-cuenta-modal/estado-cuenta-modal.component";
import {MatDialog} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
    selector: 'app-predial',
    templateUrl: './predial.component.html',
    styleUrls: ['./predial.component.css']
})
export class PredialComponent implements OnInit {

    public predialForm: any;

    public dataSource: any;
    public displayedColumns: string[] = ['clave', 'direccion', 'estado_cuenta', 'accion'];
    public expandedElement: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    /* Banderas */
    public creating = false;
    public loading = false;

    constructor(
        private predialService: PredialService,
        private messagesService: MessageService,
        private formBuilder: UntypedFormBuilder,
        public dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.initClaveForm();
        this.getClaves();
    }

    initClaveForm() {
        this.predialForm = this.formBuilder.group({
            clave: ['', Validators.required]
        });
    }

    getClaves() {
        this.predialService.getRecords().subscribe({
                next: res => {
                    this.dataSource = new MatTableDataSource(res.claves);
                },
                error: err => {
                    this.messagesService.printStatus(err.error.errors, 'error');
                }
            }
        );
    }

    createClave() {
        this.creating = true;
        const data = this.predialForm.value;
        this.predialService.createRecords(data).subscribe({
            next: res => {
                this.creating = false;
                this.predialForm.reset();
                this.messagesService.printStatus(res.message, 'success')
                setTimeout(() => {
                    this.getClaves();
                }, 2500);
            },
            error: err => {
                this.creating = false;
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        });
    }

    deleteClave(clave: any){
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
    }

    getEstadoCuenta(clave: any, i: number) {
        this.loading = true;
        let data = {'clave': clave};
        this.predialService.getEstadoCuenta(data).subscribe({
            next: res => {
                this.loading = false;
                this.openDialog(res, clave);
            },
            error: err => {
                this.loading = false;
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        });
    }

    openDialog(estadoCuenta: any, clave?: any) {
        const config = {
            width: '80%',
            data: {
                content: estadoCuenta ? estadoCuenta : false,
                clave: clave ? clave : false
            }
        };

        const dialogRef = this.dialog.open(EstadoCuentaModalComponent, config);

        dialogRef.afterClosed().subscribe(() => {
            this.getClaves();
        });
    }

}
