import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AuthGuard } from '../backoffice/auth.guard'; // Ensure you have an AuthGuard to protect routes
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard], // Protect the route with AuthGuard
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: '/login', pathMatch: 'full' }

      // Add more admin routes here
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }