import { Component } from '@angular/core';
import { HeroComponent } from "./hero/hero.component";
import { AboutComponent } from "./about/about.component";
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
// import { ContactMeComponent } from './contact-me/contact-me.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { QuickViewComponent } from "./quick-view/quick-view.component"
import { FooterComponent } from '../../shared/footer/footer.component';
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HeroComponent, AboutComponent, HowItWorksComponent, HeaderComponent, QuickViewComponent, FooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  appTitle = 'MyDreamWeddingByCass';
  subTitle = 'Easy Event Rentals in the Treasure Valley';
}
