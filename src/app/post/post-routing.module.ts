import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './post.component';

const routes: Routes = [
  { path: '', component: PostComponent },
  {
    path: ':id',
    loadChildren: () => import('./post-detail/post-detail.module').then(m => m.PostDetailModule)
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
