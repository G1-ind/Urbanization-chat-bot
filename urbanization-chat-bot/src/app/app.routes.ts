import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { ContributersComponent } from './contributers/contributers.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {path:'home',component: HomeComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat-bot', component: ChatBotComponent },
  { path: 'contributors', component: ContributersComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}, // Default route
  { path: '**', redirectTo: '/home', pathMatch: 'full' } // Catch-all route
];
