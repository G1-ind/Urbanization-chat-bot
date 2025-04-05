import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingRoutingModule } from './app-routing-routing.module';
import { AppComponent } from './app.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { ContributersComponent } from './contributers/contributers.component';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  declarations: [
    AppComponent,
    ChatBotComponent,
    ContributersComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    AppRoutingRoutingModule
  ]
})
export class AppRoutingModule {
  
 }
