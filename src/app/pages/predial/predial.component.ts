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
import {NgxSpinnerService} from "ngx-spinner";
import {RequestService} from "../../services/request.service";
import {Router} from "@angular/router";

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
    
    /* Contador de dígitos */
    public digitCount = 0;

    constructor(
        private predialService: PredialService,
        private messagesService: MessageService,
        private formBuilder: UntypedFormBuilder,
        private spinner: NgxSpinnerService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.initClaveForm();
        this.getClaves();
    }

    initClaveForm() {
        this.predialForm = this.formBuilder.group({
            clave: ['', [Validators.required, this.claveValidator.bind(this)]]
        });
    }

    /**
     * Validador personalizado para la clave catastral
     * Debe tener 15 dígitos, guion y opcionalmente 0-3 dígitos más
     */
    claveValidator(control: any) {
        if (!control.value) {
            return null;
        }

        const value = control.value;
        // Validar que no tenga espacios
        if (/\s/.test(value)) {
            return { hasSpaces: true };
        }

        // Patrón: 15 dígitos + guion + 0-3 dígitos opcionales
        const pattern = /^\d{15}-\d{0,3}$/;
        
        if (!pattern.test(value)) {
            // Verificar si al menos tiene 15 dígitos sin el guion
            const digitsOnly = value.replace(/[^0-9]/g, '');
            if (digitsOnly.length < 15) {
                return { insufficientDigits: true };
            }
            return { invalidFormat: true };
        }

        return null;
    }

    /**
     * Formatea automáticamente la clave catastral
     * Agrega el guion después de 15 dígitos
     */
    onClaveInput(event: any) {
        let value = event.target.value;
        
        // Eliminar todos los caracteres que no sean dígitos o guion
        value = value.replace(/[^0-9-]/g, '');
        
        // Eliminar espacios si los hay
        value = value.replace(/\s/g, '');
        
        // Eliminar guiones existentes para reconstruir el formato
        let digitsOnly = value.replace(/-/g, '');
        
        // Limitar a máximo 18 dígitos (15 + 3)
        if (digitsOnly.length > 18) {
            digitsOnly = digitsOnly.substring(0, 18);
        }
        
        // Actualizar contador de dígitos
        this.digitCount = digitsOnly.length;
        
        // Formatear: agregar guion después de 15 dígitos
        let formatted = '';
        if (digitsOnly.length <= 15) {
            formatted = digitsOnly;
        } else {
            formatted = digitsOnly.substring(0, 15) + '-' + digitsOnly.substring(15);
        }
        
        // Si ya tiene exactamente 15 dígitos, agregar el guion
        if (digitsOnly.length === 15 && !formatted.includes('-')) {
            formatted = digitsOnly + '-';
        }
        
        // Actualizar el valor del formulario
        this.predialForm.patchValue({
            clave: formatted
        }, { emitEvent: false });
        
        // Actualizar el input
        event.target.value = formatted;
    }

    getClaves() {
        this.spinner.show();
        this.predialService.getRecords().subscribe({
                next: res => {
                    console.log(res);
                    this.spinner.hide();
                    this.dataSource = new MatTableDataSource(res.claves);
                },
                error: err => {
                    this.spinner.hide();
                    this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                }
            }
        );
    }

    createClave() {
        this.spinner.show();
        const data = this.predialForm.value;
        this.predialService.createRecords(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.predialForm.reset();
                this.messagesService.printStatus(res.message, 'success')
                setTimeout(() => {
                    this.getClaves();
                }, 2500);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
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
                this.spinner.show();
                this.predialService.deleteClave(data).subscribe(
                    res => {
                        this.spinner.hide();
                        this.messagesService.printStatus(res.message, 'success')
                        setTimeout(() => {
                            this.getClaves();
                        }, 2500);
                    },
                    err => {
                        this.spinner.hide();
                        this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                    }
                )
            }
        });
    }


    getEstadoCuenta(clave: any, i: number) {
        this.spinner.show()
        let data = {
            clave: clave.clave
        };
        this.predialService.getEstadoCuenta(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.openDialog(res, clave);
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
                content: estadoCuenta ? estadoCuenta : false,
                clave: clave ? clave : false,
                claveId: clave ? clave.id : false
            }
        };

        const dialogRef = this.dialog.open(EstadoCuentaModalComponent, config);

        dialogRef.afterClosed().subscribe(() => {
            this.getClaves();
        });
    }

}
