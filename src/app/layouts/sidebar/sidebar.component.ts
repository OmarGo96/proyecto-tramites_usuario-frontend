import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UsersService} from "../../services/users.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    public menuItems: any;
    public menu: any;
    public user: any;

    constructor(
        private usersService: UsersService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.user = this.usersService.getIdentity();
        this.setMenuItem();
    }

    setMenuItem(){
        this.menuItems = ROUTES.filter(menuItem => menuItem);

        const groups = new Set(this.menuItems.map((item: any) => item.group));

        this.menu = [];
        groups.forEach(g =>
            this.menu.push({
                    name: g,
                    values: this.menuItems.filter((i: any) => i.group === g),
                    module: ''
                }
            ));

        for (let i = 0; i < this.menu.length; i++) {
            for (let j = 0; j < this.menu[i].values.length; j++) {
                this.menu[i].module = this.menu[i].values[j].module;
            }
        }
    }

    logout(): void {
        this.usersService.logout();
    }

}

export const ROUTES = [
    {
        path: '/escritorio',
        group: 'INICIO',
        module: 'servicios',
        action: 'list',
        title: 'Iniciar trámite',
        icon: 'fa-folder-open',
        class: ''
    },
    {
        path: '/escritorio/solicitudes',
        group: 'SOLICITUDES',
        module: 'solicitudes',
        action: 'list',
        title: 'Ver todas',
        icon: 'fa-list',
        class: ''
    },
    {
        path: '/escritorio/predial',
        group: 'PREDIAL',
        module: 'servicios',
        action: 'list',
        title: 'Impuesto Predial',
        icon: 'fa-building-flag',
        class: ''
    },
    /*{
        path: '/escritorio/licencia-funcionamiento',
        group: 'TRAMITES Y SERVICIOS',
        module: 'servicios',
        action: 'list',
        title: 'Lic. de Funcionamiento ',
        icon: 'fa-users',
        class: ''
    },*/
    {
        path: '/escritorio/documentos',
        group: 'DOCUMENTOS DIGITALES',
        module: 'documentos',
        action: 'list',
        title: 'Exp. único y doc. generales',
        icon: 'fa-file-export',
        class: ''
    },
    {
        path: '/escritorio/documentos',
        group: 'DOCUMENTOS DIGITALES',
        module: 'documentos',
        action: 'list',
        title: 'Imprimir acuse exp. único',
        icon: 'fa-print',
        class: ''
    }
];

