import { Component } from '@angular/core';
import { HeroComponent } from "./hero/hero.component";
import { AboutComponent } from "./about/about.component";
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { QuickViewComponent } from "./quick-view/quick-view.component"
import { FooterComponent } from '../../shared/footer/footer.component';
import { BannerComponent } from './banner/banner.component';
import { TestimonialsComponent } from "./testimonials/testimonials.component";
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HeroComponent, AboutComponent, HowItWorksComponent, HeaderComponent, QuickViewComponent, FooterComponent, BannerComponent, TestimonialsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  appTitle = 'MyDreamWeddingByCass';
  subTitle = 'Easy Event Rentals in the Treasure Valley';
}
