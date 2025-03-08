import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomepageComponent } from './home/homepage/homepage.component';
import { ShopComponent } from './shop/shop.component';
import { ProductPageComponent } from './features/product-page/product-page.component';
import { CartComponent } from './cart/cart-page/cart-page.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LoginComponent } from './backoffice/login/login.component';
import { InspoComponent } from './inspo/inspo.component';
import { AuthGuard } from './backoffice/auth.guard';
import { AdminDashboardComponent } from './backoffice/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './backoffice/admin-products/admin-products.component';
import { AdminReservationsComponent } from './backoffice/admin-reservations/admin-reservations.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent }, // Default route for homepage
    { path: 'home', component: HomepageComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'inspo', component: InspoComponent },
    { path: 'cart', component: CartComponent },
    { path: 'notFound', component: NotFoundComponent },
    { path: 'product/:productId', component: ProductPageComponent },
    { path: 'login', component: LoginComponent }, // Add the login route
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'products', component: AdminProductsComponent, canActivate: [AuthGuard] },
      { path: 'reservations', component: AdminReservationsComponent, canActivate: [AuthGuard] },
      // Add more admin routes here
    ]},
    { path: '**', component: HomepageComponent }, // Redirect any incorrect URLs to home
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
