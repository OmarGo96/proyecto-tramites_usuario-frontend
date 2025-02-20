import {Component, OnInit} from '@angular/core';
import {UploadModalComponent} from 'src/app/layouts/modals/upload-modal/upload-modal.component';
import {MessageService} from "../../services/messages.service";
import {MatDialog} from "@angular/material/dialog";
import {DocumentsService} from "../../services/documents.service";
import {DocumentTypesService} from "../../services/document-types.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExpedienteUnicoDocs} from "../../const/expediente-unico-docs";
import {
    ExpedienteUploadModalComponent
} from "../../layouts/modals/expediente-upload-modal/expediente-upload-modal.component";
import {UsersService} from "../../services/users.service";

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

    public documents: any;
    public documentTypes: any;

    public expedienteUnico: any;

    private user: any;

    constructor(
        private documentsService: DocumentsService,
        private documentTypesService: DocumentTypesService,
        private usersService: UsersService,
        private spinner: NgxSpinnerService,
        private messagesService: MessageService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getDocumentTypes();
        this.user = this.usersService.getIdentity();
        console.log(this.user);

    }

    openUploadDialog(): void {
        const config = {
            width: '50%',
            data: {
                title: false
            },
        }

        const dialogRef = this.dialog.open(UploadModalComponent, config);

        dialogRef.afterClosed().subscribe(res => {
            this.getDocuments()
        });
    }

    openUploadExpedienteDialog(tipoDocumentoId: any): void {
        const config = {
            width: '50%',
            data: {
                tipo_documento_id: tipoDocumentoId
            },
        }

        const dialogRef = this.dialog.open(ExpedienteUploadModalComponent, config);

        dialogRef.afterClosed().subscribe(res => {
            this.getExpedienteUnico()
        });
    }

    getDocumentTypes() {
        this.spinner.show();
        this.documentTypesService.getRecords().subscribe({
            next: res => {
                this.documentTypes = res.documentos;
                this.getExpedienteUnico();
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                this.spinner.hide();
            }
        })
    }

    getExpedienteUnico() {
        this.documentsService.getExpedienteUnico(this.user.uuid).subscribe({
            next: res => {
                this.expedienteUnico = res.documentacionExpediente;
                this.spinner.hide();
                this.getDocuments();
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                this.spinner.hide();
            }
        })
    }

    getDocuments() {
        this.documentsService.getRecords().subscribe({
            next: res => {
                this.documents = res.documentacion
                this.spinner.hide();
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                this.spinner.hide();
            }
        })
    }


    openDocument(documentacion: any) {
        this.spinner.show();
        this.documentsService.getUserDocument(documentacion.id).subscribe({
            next: res => {
                let downloadURL = window.URL.createObjectURL(res);

                if(res.type == 'application/dwg' || res.type == 'application/dxf') {
                    let link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = documentacion.url;
                    link.click();
                }  else {
                    window.open(downloadURL, '_blank')
                }

                this.spinner.hide();
            },
            error: err => {
                this.messagesService.printStatus('Ocurrió un error al obtener el documento.', 'error');
                this.spinner.hide();
            }
        });
    }

    deleteFile(documentId: any) {
        this.messagesService.confirmDelete('¿Estás seguro de eliminar este archivo?')
            .then((result: any) => {
                console.log(result);
                if (result.isConfirmed) {
                    this.spinner.show();
                    this.documentsService.deleteDocument(documentId).subscribe({
                        next: res => {
                            this.spinner.hide();
                            this.messagesService.printStatus(res.message, 'success');
                            setTimeout(() => {
                                this.getDocuments();
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

    printFile(){
        this.spinner.show();
        this.documentsService.printFile(this.user.uuid).subscribe({
            next: res => {
                this.spinner.hide();
                let downloadURL = window.URL.createObjectURL(res);
                window.open(downloadURL, '_blank');
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatus('Algo salio mal al obtener el documento. Intente mas tarde.', 'warning');
            }
        })
    }
}
