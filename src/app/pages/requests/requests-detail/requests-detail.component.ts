import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../../services/messages.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../services/request.service";
import {MatTableDataSource} from "@angular/material/table";
import {RequestsStatus} from "../../../const/status";
import {MatDialog} from "@angular/material/dialog";
import {DocumentsModalComponent} from "../../../layouts/modals/documents-modal/documents-modal.component";
import {DocumentsService} from "../../../services/documents.service";
import {FormBuilder, UntypedFormBuilder} from "@angular/forms";
import {NgxSpinner, NgxSpinnerService} from "ngx-spinner";
import {PaymentDocs} from "../../../const/payment-docs";
import {AnuenciaDocs} from "../../../const/anuencia-docs";
import {GiroComercialDoc} from "../../../const/giro-comercial-docs";
import {PredialService} from "../../../services/predial.service";

@Component({
    selector: 'app-requests-detail',
    templateUrl: './requests-detail.component.html',
    styleUrls: ['./requests-detail.component.css']
})
export class RequestsDetailComponent implements OnInit {

    public solicitudForm: any;

    public request: any;
    public requeriments: any;
    public reqWithDocuments: any;
    public reqMandatory: any;
    public paymentDocRejected: any;
    public records: any;
    public messages: any;
    public files: File[] = [];
    public requestId: any;

    public dataSource: any;
    public displayedColumns: string[] = ['requisito', 'seleccionar', 'archivo'];

    /* Banderas */
    public loading = false;
    public saving = false;
    public reUpload = false;

    // Constants
    public statuses = RequestsStatus;
    public paymentDocs = PaymentDocs;
    public anuenciaDocs = AnuenciaDocs;
    public giroComercial = GiroComercialDoc;

    constructor(
        private requestsService: RequestService,
        private messagesService: MessageService,
        private predialService: PredialService,
        private documentsService: DocumentsService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private spinner: NgxSpinnerService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getId();
    }

    initSolicitudForm() {
        this.solicitudForm = this.formBuilder.group({
            estatus_solicitud_id: [''],
            solicitud_id: [''],
            comentario: this.request.comentario ? this.request.comentario : ['']
        });
    }

    getId() {
        this.activatedRoute.params.subscribe({
            next: res => {
                this.spinner.show();
                this.getSolicitud(res['id']);
            },
            error: err => {
                console.log(err);
            }
        });
    }

    getSolicitud(id: any) {
        this.requestsService.getRecord(id).subscribe({
            next: res => {
                this.request = res.solicitud;
                this.requeriments = res.requisitos;

                if (this.request.DocumentosPago.length > 0) {
                    for (const doc of this.request.DocumentosPago) {
                        this.paymentDocs.map(docu => {
                            if (docu.id === doc.documento_pago) {
                                docu.doc = doc;
                            }
                        });
                    }
                }

                if (this.request.DocumentosAnuencia.length > 0) {
                    for (const doc of this.request.DocumentosAnuencia) {
                        console.log(doc);
                        this.anuenciaDocs.map(docu => {
                            if (docu.id === doc.documento_anuencia) {
                                docu.doc = doc;
                            }
                        });
                    }
                }

                if (this.request.DocumentosLicenciaComercial.length > 0) {
                    for (const doc of this.request.DocumentosLicenciaComercial) {
                        this.giroComercial.map(docu => {
                            if (docu.id === doc.documento_licencia_comercial) {
                                docu.doc = doc;
                            }
                        });
                    }
                }

                this.reqWithDocuments = res.requisitos.filter((req: any) => req.obligatorio === 1 && req.Requisito.Documento);
                this.reqMandatory = res.requisitos.filter((req: any) => req.obligatorio === 1);

                this.dataSource = new MatTableDataSource(res.requisitos);
                this.initSolicitudForm();
                this.getHistory(res.solicitud.id);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    getHistory(requestId: any) {
        this.requestsService.getHistory(requestId).subscribe({
            next: res => {
                this.records = res.history;
                this.getMessages(requestId);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    getMessages(requestId: any) {
        this.requestsService.getMessages(requestId).subscribe({
            next: res => {
                this.spinner.hide();
                this.messages = res.mensajes;
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    saveRequest(status: any) {
        this.spinner.show();
        this.solicitudForm.controls.estatus_solicitud_id.setValue(status);
        // this.solicitudForm.controls.solicitud_id.setValue(this.request.id.toString());
        const data = this.solicitudForm.value;
        this.requestsService.updateRecord(data, this.request.id.toString()).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
                setTimeout(() => {
                    this.router.navigate(['escritorio/solicitudes']);
                }, 2500);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    validatePayment(status: any) {
        this.spinner.show();
        this.solicitudForm.controls.estatus_solicitud_id.setValue(status);
        // this.solicitudForm.controls.solicitud_id.setValue(this.request.id.toString());
        const data = this.solicitudForm.value;
        this.requestsService.updateRecord(data, this.request.id.toString()).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
                setTimeout(() => {
                    this.getId();
                }, 2500);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    changeStatus(status: any) {
        this.spinner.show();
        this.solicitudForm.controls.estatus_solicitud_id.setValue(status);
        // this.solicitudForm.controls.solicitud_id.setValue(this.request.id.toString());
        const data = this.solicitudForm.value;
        this.requestsService.updateRecord(data, this.request.id.toString()).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
                setTimeout(() => {
                    this.getId();
                }, 2500);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    generarContanciaPredial(constanciaUuid: string) {
        this.spinner.show();
        this.predialService.generarConstancia(constanciaUuid).subscribe({
            next: res => {
                this.spinner.hide();
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    selectDocument(requisitoId: any): void {
        const config = {
            width: '100%'
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.setDocument(document, requisitoId);
            }
        });
    }

    reSelectDocumentToUpdate(requisitoId: any, documentoSolicitudRequisitoId: any) {
        const config = {
            width: '100%',
            data: {
                title: ''
            },
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.updateDocument(document, requisitoId, documentoSolicitudRequisitoId);
            }
        });
    }

    selectPaymentDocument(documentId: any): void {
        const config = {
            width: '100%'
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.setPaymentDocument(document, documentId);
            }
        });
    }

    selectGiroDocument(documentId: any): void {
        const config = {
            width: '100%'
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.setGiroDocument(document, documentId);
            }
        });
    }

    setGiroDocument(document: any, documentId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            documento_licencia_comercial: documentId
        }

        this.documentsService.createDocumentoGiro(data).subscribe({
            next: res => {
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    reSelectGiroDocumentToUpdate(documentoAnuenciaVal: any, documentacionAnuenciaId: any): void {
        const config = {
            width: '100%'
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.updateGiroDocument(document, documentoAnuenciaVal, documentacionAnuenciaId);
            }
        });
    }

    updateGiroDocument(document: any, documentoAnuenciaVal: any, documentacionAnuenciaId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            documento_licencia_comercial: documentoAnuenciaVal
        }

        this.documentsService.updateDocumentoGiro(data, documentacionAnuenciaId).subscribe({
            next: res => {
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    selectAnuenciaDocument(documentId: any): void {
        const config = {
            width: '100%'
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.setAnuenciaDocument(document, documentId);
            }
        });
    }

    setAnuenciaDocument(document: any, documentId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            documento_anuencia: documentId
        }

        this.documentsService.createDocumentoAnuencia(data).subscribe({
            next: res => {
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    reSelectAnuenciaDocumentToUpdate(documentoAnuenciaVal: any, documentacionAnuenciaId: any): void {
        const config = {
            width: '100%'
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.updateAnuenciaDocument(document, documentoAnuenciaVal, documentacionAnuenciaId);
            }
        });
    }

    updateAnuenciaDocument(document: any, documentoAnuenciaVal: any, documentacionAnuenciaId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            documento_anuencia: documentoAnuenciaVal
        }

        this.documentsService.updateDocumentoAnuencia(data, documentacionAnuenciaId).subscribe({
            next: res => {
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    reSelectPaymentDocumentToUpdate(documentoPagoVal: any, documentacionPagoId: any): void {
        const config = {
            width: '100%'
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.updatePaymentDocument(document, documentoPagoVal, documentacionPagoId);
            }
        });
    }

    setDocument(document: any, requisitoId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            requisito_id: requisitoId
        }

        this.documentsService.createDocumentoSolicitud(data).subscribe({
            next: res => {
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    setPaymentDocument(document: any, documentId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            documento_pago: documentId
        }

        this.documentsService.createDocumentoPago(data).subscribe({
            next: res => {
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    updatePaymentDocument(document: any, documentoPagoVal: any, documentacionPagoId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            documento_pago: documentoPagoVal
        }

        this.documentsService.updateDocumentoPago(data, documentacionPagoId).subscribe({
            next: res => {
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    updateDocument(document: any, requisitoId: any, documentoSolicitudRequisitoId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            requisito_id: requisitoId
        }

        this.documentsService.updateDocumentSolicitudRequisito(documentoSolicitudRequisitoId, data).subscribe({
            next: res => {
                this.reUpload = false;
                this.requestId = null;
                this.spinner.hide();
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    openDocument(documentacion: any) {
        this.documentsService.getUserDocument(documentacion.id).subscribe({
            next: res => {
                let downloadURL = window.URL.createObjectURL(res);

                if (res.type == 'application/dwg' || res.type == 'application/dxf') {
                    let link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = documentacion.url;
                    link.click();
                } else {
                    window.open(downloadURL, '_blank')
                }
            },
            error: err => {
                this.messagesService.printStatus('Algo salio mal al obtener el documento. Intente mas tarde.', 'warning');
            }
        });
    }

    openPaymentDocument(documentId: any) {
        this.documentsService.getUserDocument(documentId).subscribe({
            next: res => {
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
            },
            error: err => {
                this.messagesService.printStatus('Algo salio mal al obtener el documento. Intente mas tarde.', 'warning');
            }
        });
    }

    openAnuenciaDocument(documentId: any) {
        this.documentsService.getUserDocument(documentId).subscribe({
            next: res => {
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
            },
            error: err => {
                this.messagesService.printStatus('Algo salio mal al obtener el documento. Intente mas tarde.', 'warning');
            }
        });
    }

    openDocumentComplementary(documentId: any) {
        this.documentsService.getUserDocument(documentId).subscribe({
            next: res => {
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
            },
            error: err => {
                this.messagesService.printStatus('Algo salio mal al obtener el documento. Intente mas tarde.', 'warning');
            }
        });
    }

    getRequestDocument(requestId: any) {
        this.documentsService.getRequestDocument(requestId).subscribe({
            next: res => {
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
            },
            error: err => {
                this.messagesService.printStatus('Algo salio mal al obtener el documento. Intente mas tarde.', 'warning');
            }
        });
    }

    reUploadDocument(documentacionId: any) {
        this.messagesService.confirmDelete('¿Estás seguro de eliminar este archivo?').then((result: any) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.documentsService.deleteDocumentoSolicitud(documentacionId).subscribe({
                    next: res => {
                        this.spinner.hide();
                        this.messagesService.printStatus(res.message, 'success');
                        setTimeout(() => {
                            this.getId();
                        }, 2500);
                    },
                    error: err => {
                        this.spinner.hide();
                        this.messagesService.errorAlert(err.error.errors);
                    }
                })
            }
        });
    }

    reUploadDocumentoPago(documentacionId: any) {
        this.messagesService.confirmDelete('¿Estás seguro de eliminar este archivo?').then((result: any) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.documentsService.deleteDocumentoPago(documentacionId).subscribe({
                    next: res => {
                        this.spinner.hide();
                        this.messagesService.printStatus(res.message, 'success');
                        setTimeout(() => {
                            location.reload();
                        }, 2500);
                    },
                    error: err => {
                        this.spinner.hide();
                        this.messagesService.errorAlert(err.error.errors);
                    }
                })
            }
        });
    }

    reUploadDocumentoAnuencia(documentacionId: any) {
        this.messagesService.confirmDelete('¿Estás seguro de eliminar este archivo?').then((result: any) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.documentsService.deleteDocumentoAnuencia(documentacionId).subscribe({
                    next: res => {
                        this.spinner.hide();
                        this.messagesService.printStatus(res.message, 'success');
                        setTimeout(() => {
                            location.reload();
                        }, 2500);
                    },
                    error: err => {
                        this.spinner.hide();
                        this.messagesService.errorAlert(err.error.errors);
                    }
                })
            }
        });
    }

    reUploadDocumentoGiro(documentacionId: any) {
        this.messagesService.confirmDelete('¿Estás seguro de eliminar este archivo?').then((result: any) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.documentsService.deleteDocumentoGiro(documentacionId).subscribe({
                    next: res => {
                        this.spinner.hide();
                        this.messagesService.printStatus(res.message, 'success');
                        setTimeout(() => {
                            location.reload();
                        }, 2500);
                    },
                    error: err => {
                        this.spinner.hide();
                        this.messagesService.errorAlert(err.error.errors);
                    }
                })
            }
        });
    }

    reUploadDocumentoComplementario(documentacionId: any) {
        this.messagesService.confirmDelete('¿Estás seguro de eliminar este archivo?').then((result: any) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.documentsService.deleteDocumentoComplementario(documentacionId).subscribe({
                    next: res => {
                        this.spinner.hide();
                        this.messagesService.printStatus(res.message, 'success');
                        setTimeout(() => {
                            location.reload();
                        }, 2500);
                    },
                    error: err => {
                        this.spinner.hide();
                        this.messagesService.errorAlert(err.error.errors);
                    }
                })
            }
        });
    }

    uploadFiles() {
        this.files.forEach((file: any) => {
            this.createDocuments(file);
        });
    }

    selectComplementaryDocument(): void {
        const config = {
            width: '100%'
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.setComplementaryDocument(document);
            }
        });
    }

    setComplementaryDocument(document: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id
        }

        this.documentsService.createComplementaryDocument(data).subscribe({
            next: res => {
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    reSelectComplementaryDocumentToUpdate(documentacionAnuenciaId: any): void {
        const config = {
            width: '100%'
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.updateComplementaryDocument(document, documentacionAnuenciaId);
            }
        });
    }

    updateComplementaryDocument(document: any, documentacionAnuenciaId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id
        }

        this.documentsService.updateDocumentoComplementario(data, documentacionAnuenciaId).subscribe({
            next: res => {
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    validateComplementaryDocument(status: any) {
        this.spinner.show();
        this.solicitudForm.controls.estatus_solicitud_id.setValue(status);
        // this.solicitudForm.controls.solicitud_id.setValue(this.request.id.toString());
        const data = this.solicitudForm.value;
        this.requestsService.updateRecord(data, this.request.id.toString()).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
                setTimeout(() => {
                    this.getId();
                }, 2500);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    createDocuments(file: any) {
        this.spinner.show();
        let formData = new FormData()
        formData.append('file', file);
        this.documentsService.anuenciaDocument(this.request.id.toString(), formData).subscribe({
            next: res => {
                this.updateRequestEstatus();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    updateRequestEstatus() {
        const data = {
            estatus_solicitud_id: '23'
        };
        this.requestsService.updateRecord(data, this.request.id.toString()).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
                setTimeout(() => {
                    this.getId();
                }, 2500);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    onSelect(event: any) {
        this.files.push(...event.addedFiles);
    }

    onRemove(event: any) {
        this.files.splice(this.files.indexOf(event), 1);
    }

    redirectToService() {
        this.router.navigate(['escritorio/tramites/8e9b4ee4-6d60-41fd-851e-3e7d0ce06c4e']);
    }

    redirectToGiroComercial() {
        this.router.navigate(['escritorio/tramites/b8ef16e0-12d4-415d-90e8-57b9427a47e0']);
    }


}
