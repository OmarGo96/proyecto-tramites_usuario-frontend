import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from "./layouts/base/base.component";
import {PublicComponent} from "./pages/public/public.component";

const routes: Routes = [
    { path: '', component: PublicComponent },
    {
        path: '',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'escritorio',
        component: BaseComponent,
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
