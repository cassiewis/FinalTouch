import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  inspoImages!: boolean;

  constructor(private router: Router) {}

  routeTo(path: string) {
    this.router.navigate([path]).then(() => {
      // Ensure smooth scrolling to the top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50); // Delay to allow Angular's routing to settle before scrolling
    });
  }

  routeToSection(path: string, fragment: string) {
    this.router.navigate([path], { fragment: fragment }).then(() => {
      // Use setTimeout to ensure navigation completes before trying to scroll
      setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0); // delay the execution to ensure navigation finishes first
    });
  }
}
