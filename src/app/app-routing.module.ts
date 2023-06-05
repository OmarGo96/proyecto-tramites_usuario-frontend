import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from "./layouts/base/base.component";
import {PublicComponent} from "./pages/public/public.component";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
    { path: '', component: PublicComponent },
    {
        path: '',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'escritorio',
        component: BaseComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {
}
