import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    public singleMenuItems: any;
    public dropdownMenu = false;
    public groupMenuItems: any;

    constructor(
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.sideBarMenu();
    }

    sideBarMenu(): void {
        const routes = ROUTES;
        this.groupMenuItems = [];

        const groupItems = new Set(routes.map((item: any) => item.group));
        this.singleMenuItems = routes.filter((item: any) => !item.group);

        groupItems.forEach((item: any) =>
            this.groupMenuItems.push({
                    name: item,
                    values: routes.filter((i: any) => i.group === item)
                }
            ));

        for (let i = 0; i < this.groupMenuItems.length; i++) {
            for (let j = 0; j < this.groupMenuItems[i].values.length; j++) {
                this.groupMenuItems[i].module = this.groupMenuItems[i].values[j].module;
                this.groupMenuItems[i].icon = this.groupMenuItems[i].values[j].icon;
            }
        }
    }

    openDropdownMenu() {
        this.dropdownMenu = !this.dropdownMenu;
    }

    logout(){
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('identity');
        this.router.navigate([''])
    }

}

export const ROUTES = [
    {
        path: 'solicitudes',
        group: 'Solicitudes',
        module: 'solicitudes',
        title: 'Ver todas',
        icon: 'folder',
        class: ''
    },
    {path: 'predial', module: 'predial', title: 'Impusto Predial', icon: 'receipt', class: ''},
    {path: 'licencia-funcionamiento', module: 'licencia', title: 'Lic. de Funcionamiento', icon: 'badge', class: ''}
];

