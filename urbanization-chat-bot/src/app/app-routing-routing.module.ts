import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { ContributersComponent } from './contributers/contributers.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat-bot', component: ChatBotComponent },
  { path: 'contributors', component: ContributersComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' } // Catch-all route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingRoutingModule { }
