import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-chat-bot',
  imports: [MatCardModule,CommonModule,FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent {
  userInput: string = '';
  messages: { sender: string, text: string }[] = [];

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ sender: 'user', text: this.userInput });

      // Simulate bot response
      setTimeout(() => {
        this.messages.push({ sender: 'bot', text: 'This is a placeholder response.' });
      }, 500);

      this.userInput = '';
    }
  }
}
