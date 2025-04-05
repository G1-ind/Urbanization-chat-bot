import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { ContributersComponent } from './contributers/contributers.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat-bot', component: ChatBotComponent },
  { path: 'contributors', component: ContributersComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' } // Catch-all route
];
