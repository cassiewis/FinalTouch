import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomepageComponent } from './home/homepage/homepage.component';
import { ShopComponent } from './shop/shop.component';
import { ProductPageComponent } from './features/product-page/product-page.component';
import { CartComponent } from './cart/cart-page/cart-page.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

import { BackofficeComponent } from './backoffice/backoffice.component';
import { ReservationsComponent } from './backoffice/reservations/reservations.component';
import { MessagesComponent } from './backoffice/messages/messages.component';
import { BackofficeHomeComponent } from './backoffice/backoffice-home/backoffice-home.component';
import { ProductsComponent } from './backoffice/products/products.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent }, // Default route for homepage
    { path: 'home', component: HomepageComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'cart', component: CartComponent },
    { path: 'notFound', component: NotFoundComponent },
    { path: 'product/:productId', component: ProductPageComponent },
    {
      path: 'backoffice',
      component: BackofficeComponent,
      children: [
        {
          path: '',
          component: BackofficeHomeComponent,
        },
        {
          path: 'home',
          component: BackofficeHomeComponent, // Load BackofficeHomeComponent
        },
        {
          path: 'reservations',
          component: ReservationsComponent, // Load ReservationsComponent
        },
        {
          path: 'products',
          component: ProductsComponent, // Load ProductsComponent
        },
        {
          path: 'messages',
          component: MessagesComponent, // Load MessagesComponent
        },
      ],
    },
    { path: '**', component: HomepageComponent }, // Redirect any incorrect URLs to home
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
