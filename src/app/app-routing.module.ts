import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
    },
    {
        path: 'tag',
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule)
    },
    {
        path: 'media',
        loadChildren: () => import('./media/media.module').then(m => m.MediaModule)
    },
    {
        path: 'post',
        loadChildren: () => import('./post/post.module').then(m => m.PostModule)
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }