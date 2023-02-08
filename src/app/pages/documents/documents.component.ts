import {Component, OnInit} from '@angular/core';
import {UploadModalComponent} from 'src/app/layouts/modals/upload-modal/upload-modal.component';
import {MessageService} from "../../services/messages.service";
import {MatDialog} from "@angular/material/dialog";
import {DocumentsService} from "../../services/documents.service";
import {DocumentTypesService} from "../../services/document-types.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

    public documents: any;
    public documentTypes: any;

    constructor(
        private documentsService: DocumentsService,
        private documentTypesService: DocumentTypesService,
        private spinner: NgxSpinnerService,
        private messagesService: MessageService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getDocumentTypes();
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

    getDocumentTypes() {
        this.spinner.show();
        this.documentTypesService.getRecords().subscribe({
            next: res => {
                this.documentTypes = res.documentos;
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

    openDocument(documentId: any) {
        this.spinner.show();
        this.documentsService.getUserDocument(documentId).subscribe({
            next: res => {
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
                this.spinner.hide();
            },
            error: err => {
                this.messagesService.printStatus('Ocurrio un error al obtener el documento.', 'error');
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

}
