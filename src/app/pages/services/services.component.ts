import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DependenciesService} from 'src/app/services/dependencies.service';
import {MessageService} from 'src/app/services/messages.service';
import {ServicesService} from 'src/app/services/services.service';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

    public direction: any;
    public services: any;

    constructor(
        private servicesService: ServicesService,
        private dependenciesService: DependenciesService,
        private messagesService: MessageService,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.getUuid();
    }

    getUuid() {
        this.activatedRoute.params.subscribe({
            next: res => {
                this.getDirection(res['uuid']);
            },
            error: err => {
                console.log(err);
            }
        });
    }

    getDirection(uuid: any) {
        this.dependenciesService.getRecord(uuid).subscribe({
            next: res => {
                this.direction = res.area;
                this.getServicesByArea(res.area.uuid);
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    getServicesByArea(uuid: any) {
        this.servicesService.getServices(uuid).subscribe({
            next: res => {
                this.services = res.servicios;
                console.log(this.services);
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

}
