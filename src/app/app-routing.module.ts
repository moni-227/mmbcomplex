import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { DownloadComponent } from './download/download.component';
import { UserComponent } from './user/user.component';
import { PaymentComponent } from './payment/payment.component';
import { PaidComponent } from './paid/paid.component';
import { NotpaidComponent } from './notpaid/notpaid.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main', component: MainComponent },

  { path: 'download', component: DownloadComponent },
  { path: 'userd', component: UserComponent },
  { path: 'pay', component: PaymentComponent },
  { path: 'paid', component: PaidComponent },
  { path: 'notpaid', component: NotpaidComponent },

  { path: 'profile', component: ProfileComponent },
  { path: 'dash', component: DashboardComponent },

  { path: 'inv', component: InvoiceComponent },






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
