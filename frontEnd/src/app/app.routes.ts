import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomepageComponent } from './home/homepage/homepage.component';
import { ShopComponent } from './shop/shop.component';
import { ProductPageComponent } from './features/product-page/product-page.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LoginComponent } from './backoffice/login/login.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { CartNotEmptyGuard } from './guards/cart-not-empty.guard';

export const routes: Routes = [
    { path: '', component: HomepageComponent }, // Default route for homepage
    { path: 'home', component: HomepageComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'inspo', loadComponent: () => import('./inspo/inspo.component').then((m) => m.InspoComponent),},
    { path: 'cart', loadComponent: () => import('./cart/cart-page/cart-page.component').then((m) => m.CartComponent),},
    // { path: 'checkout', component: CheckoutComponent, canActivate: [CartNotEmptyGuard]},
    { path: 'notFound', component: NotFoundComponent },
    { path: 'product/:productId', component: ProductPageComponent },
    { path: 'login', component: LoginComponent }, // Add the login route
    { path: 'admin', loadChildren: () =>import('./backoffice/backoffice.module').then(m => m.BackofficeModule)},
    { path: '**', component: HomepageComponent }, // Redirect any incorrect URLs to home
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
