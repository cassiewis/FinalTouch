import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomepageComponent } from './home/homepage/homepage.component';
import { ShopComponent } from './shop/shop.component';
import { ProductPageComponent } from './features/product-page/product-page.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LoginComponent } from './backoffice/login/login.component';
import { SuccessPageComponent } from './cart/success-page/success-page.component';
import { ReservationSuccessGuard } from './guards/reservation-success.guard';
import { FaqsComponent } from './home/homepage/faqs/faqs.component';
export const routes: Routes = [
    { path: '', loadComponent: () => import('./home/homepage/homepage.component').then(m => m.HomepageComponent) },
    { path: 'home', loadComponent: () => import('./home/homepage/homepage.component').then(m => m.HomepageComponent) },
    { path: 'shop', loadComponent: () => import('./shop/shop.component').then(m => m.ShopComponent) },
    { path: 'inspo', loadComponent: () => import('./inspo/inspo.component').then((m) => m.InspoComponent),},
    { path: 'cart', loadComponent: () => import('./cart/cart-page/cart-page.component').then((m) => m.CartComponent),},
    { path: 'reservation-success', loadComponent: () => import('./cart/success-page/success-page.component').then(m => m.SuccessPageComponent), canActivate: [ReservationSuccessGuard] },
    { path: 'faqs', loadComponent: () => import('./home/homepage/faqs/faqs.component').then(m => m.FaqsComponent) },
    { path: 'notFound', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) },
    { path: 'product/:productId', loadComponent: () => import('./features/product-page/product-page.component').then(m => m.ProductPageComponent) },
    { path: 'login', loadComponent: () => import('./backoffice/login/login.component').then(m => m.LoginComponent) },
    { path: 'admin', loadChildren: () =>import('./backoffice/backoffice.module').then(m => m.BackofficeModule)},
    { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
