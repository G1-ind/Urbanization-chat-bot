import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewChecked  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UrbanizationService, UrbanShiftInput } from '../service/urbanization.service';

@Component({
  selector: 'app-chat-bot',
  imports: [MatCardModule,CommonModule,FormsModule,MatIconModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements AfterViewChecked  {
  @ViewChild('chatBody') private chatBody!: ElementRef;
  predictionResult:any;
  userInput: string = '';
  messages: { sender: string, text: string }[] = [];
conversationStep: number = 0;

userData: any = {
  population_density: null,
  green_cover_percentage: null,
  road_density: null,
  nighttime_light_intensity: null,
  water_bodies_nearby: null
};
  conversationStarted: boolean = false;
  constructor(private urbanService: UrbanizationService) {}

  ngOnInit(): void { 
  }

  
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }



  async predictDummy() {
    const dummyData: UrbanShiftInput = {
      "population_density": 950.5,
      "green_cover_percentage": 18.2,
      "road_density": 42.1,
      "nighttime_light_intensity": 65.8,
      "water_bodies_nearby": 0.9
    };

    await this.urbanService.predictUrbanShift(dummyData).subscribe({
      next: (response) => {
        this.predictionResult = response;
        console.log('Prediction Result:', this.predictionResult);
  
        // Now you can use this.predictionResult.status, .confidence_percent, etc. in your template
      },
      error: (err) => {
        console.error('Prediction error:', err);
        // Optionally set an error message variable
      }
    });
  }


  // sendMessage() {
  //   if (this.userInput.trim()) {
  //     this.messages.push({ sender: 'user', text: this.userInput });

  //     // Simulate bot response
  //     setTimeout(() => {
  //       this.messages.push({ sender: 'bot', text: 'This is a placeholder response.' });
  //     }, 500);

  //     this.userInput = '';
  //   }
  // }

  sendMessage() {
    if (!this.userInput.trim()) return;
  
    this.messages.push({ sender: 'user', text: this.userInput });
  
    if (!this.conversationStarted) {
      if (this.userInput.trim().toLowerCase() === 'hi') {
        this.conversationStarted = true;
        this.messages.push({ sender: 'bot', text: 'Hello! I can help detect urbanization shift. Let’s begin. What is the population density?' });
        this.conversationStep = 1;
      } else {
        this.messages.push({ sender: 'bot', text: 'Please type "hi" to start the urbanization shift prediction assistant.' });
      }
      this.userInput = '';
      return;
    }
  
    switch (this.conversationStep) {
      case 1:
        this.userData.population_density = parseFloat(this.userInput);
        this.messages.push({ sender: 'bot', text: 'Got it. What is the green cover percentage?' });
        this.conversationStep++;
        break;
  
      case 2:
        this.userData.green_cover_percentage = parseFloat(this.userInput);
        this.messages.push({ sender: 'bot', text: 'Thanks. What is the road density?' });
        this.conversationStep++;
        break;
  
      case 3:
        this.userData.road_density = parseFloat(this.userInput);
        this.messages.push({ sender: 'bot', text: 'Noted. What is the nighttime light intensity?' });
        this.conversationStep++;
        break;
  
      case 4:
        this.userData.nighttime_light_intensity = parseFloat(this.userInput);
        this.messages.push({ sender: 'bot', text: 'Almost done. How many water bodies are nearby?' });
        this.conversationStep++;
        break;
  
      case 5:
        this.userData.water_bodies_nearby = parseFloat(this.userInput);
        this.messages.push({ sender: 'bot', text: 'Thanks! Predicting urbanization shift... 🔍' });
  
        this.urbanService.predictUrbanShift(this.userData).subscribe({
          next: (response) => {
            this.messages.push({ sender: 'bot', text: `Prediction: ${response.status}` });
            this.messages.push({ sender: 'bot', text: `Confidence: ${response.confidence_percent}%` });
            this.messages.push({ sender: 'bot', text: `${response.interpretation}` });
          },
          error: () => {
            this.messages.push({ sender: 'bot', text: 'Oops! Prediction failed. Please try again later.' });
          }
        });
  
        // Reset everything for next session
        this.conversationStep = 0;
        this.conversationStarted = false;
        this.userData = {};
        break;
    }
  
    this.userInput = '';
  }
  
}
