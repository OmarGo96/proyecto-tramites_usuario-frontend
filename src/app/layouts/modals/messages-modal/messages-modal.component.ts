import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {RequestService} from "../../../services/request.service";
import {MessageService} from "../../../services/messages.service";

@Component({
  selector: 'app-messages-modal',
  templateUrl: './messages-modal.component.html',
  styleUrls: ['./messages-modal.component.css']
})
export class MessagesModalComponent implements OnInit {

    public records: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private requestService: RequestService,
        private messagesService: MessageService
    ) {
    }

    ngOnInit(): void {
        const requestId = this.data.requestId;
        this.getMessages(requestId);
    }

    getMessages(requestId: any){
        this.requestService.getMessages(requestId).subscribe({
            next: res => {
                this.records = res.mensajes;
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }
}
