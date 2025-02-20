import {Component, OnInit} from '@angular/core';
import {ServicesService} from "../../services/services.service";
import {MessageService} from "../../services/messages.service";

@Component({
    selector: 'app-public',
    templateUrl: './public.component.html',
    styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {

    public services: any;
    public activeServices: any;

    constructor(
        private servicesService: ServicesService,
        private messagesServices: MessageService
    ) {
    }

    ngOnInit(): void {
        this.getServices();
    }

    getServices(){
        this.servicesService.getPublicServices().subscribe({
            next: res => {
                this.services = res.servicios;
                this.activeServices = res.servicios.filter((serv: any) => serv.activo);
            },
            error: err => {
                this.messagesServices.printStatusArrayNew(err.error.errors, 'warning');
            }
        })
    }

}
