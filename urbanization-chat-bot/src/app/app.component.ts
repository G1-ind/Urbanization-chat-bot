import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet, MatSidenavModule, MatListModule, RouterModule,MatToolbarModule,MatIconModule], // ✅ Import needed modules
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'urbanization-chat-bot';
  constructor(public router: Router) {}

  // Helper method to determine if current route is home
  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }
}
