import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UserService } from './services/user.service';
import { provideHttpClient } from '@angular/common/http';
import { AddRequestComponent } from './add-request/add-request.component';
import { FormsModule } from '@angular/forms';
import { EditRequestComponent } from './edit-request/edit-request.component';
import { ApproveRequestComponent } from './approve-request/approve-request.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    TopBarComponent,
    AddRequestComponent,
    EditRequestComponent,
    ApproveRequestComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [UserService, provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
