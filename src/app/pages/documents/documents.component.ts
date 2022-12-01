import {Component, OnInit} from '@angular/core';
import {UploadModalComponent} from 'src/app/layouts/modals/upload-modal/upload-modal.component';
import {MessageService} from "../../services/messages.service";
import {MatDialog} from "@angular/material/dialog";
import {DocumentsService} from "../../services/documents.service";
import {DocumentTypesService} from "../../services/document-types.service";

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
        this.documentTypesService.getRecords().subscribe({
            next: res => {
                this.documentTypes = res.documentos;
                this.getDocuments();
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    getDocuments() {
        this.documentsService.getRecords().subscribe({
            next: res => {
                this.documents = res.documentacion
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    openDocument(documentId: any) {
        this.documentsService.getUserDocument(documentId).subscribe({
            next: res => {
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }


}
