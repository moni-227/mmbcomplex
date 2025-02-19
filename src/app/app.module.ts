import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule here
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';  // Import HttpClientModule
import { ReactiveFormsModule } from '@angular/forms';
import { DownloadComponent } from './download/download.component';
import { UserComponent } from './user/user.component';
import { PaymentComponent } from './payment/payment.component';
import { PaidComponent } from './paid/paid.component';
import { NotpaidComponent } from './notpaid/notpaid.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceComponent } from './invoice/invoice.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavbarComponent,
    DownloadComponent,
    UserComponent,
    PaymentComponent,
    PaidComponent,
    NotpaidComponent,
    ProfileComponent,
    DashboardComponent,
    InvoiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
