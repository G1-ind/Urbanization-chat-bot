import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Method to navigate to the dashboard
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);  // This is the proper navigation method in Angular
  }

}
