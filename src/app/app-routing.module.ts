import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { AddRequestComponent } from './add-request/add-request.component';
import { EditRequestComponent } from './edit-request/edit-request.component';
import { ApproveRequestComponent } from './approve-request/approve-request.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-request', component: AddRequestComponent },
  { path: 'edit-request', component: EditRequestComponent },
  { path: 'approve-request', component: ApproveRequestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
