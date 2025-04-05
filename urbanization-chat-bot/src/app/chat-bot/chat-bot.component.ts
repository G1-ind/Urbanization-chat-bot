import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-bot',
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
