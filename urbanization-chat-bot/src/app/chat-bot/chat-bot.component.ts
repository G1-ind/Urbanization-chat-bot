import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UrbanizationService, UrbanShiftInput } from '../service/urbanization.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chat-bot',
  imports: [MatCardModule, CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements AfterViewChecked {
  @ViewChildren('trendChart') trendChartsRef!: QueryList<ElementRef<HTMLCanvasElement>>;
  showChart = false;
  chartInstance: Chart | undefined;
  trendConversationStep: number = 0;
  trendMenuActive: boolean = false;
  @ViewChild('chatBody') private chatBody!: ElementRef;
  predictionResult: any;
  userInput: string = '';
  messages: { sender: string, text?: string, type?: 'text' | 'chart' }[] = [];
  conversationStep: number = 0;

  userData: any = {
    population_density: null,
    green_cover_percentage: null,
    road_density: null,
    nighttime_light_intensity: null,
    water_bodies_nearby: null
  };
  conversationStarted: boolean = false;
  menuItems: any;
  userChoise: any;
  trends: any;
  trendchoise: any;


  constructor(private urbanService: UrbanizationService,
    private cdr: ChangeDetectorRef
  ) { }

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

  async sendMessage() {
    if (!this.userInput.trim()) return;
  
    this.messages.push({ sender: 'user', text: this.userInput });
  
    // Start conversation
    if (!this.conversationStarted) {
      if (this.userInput.trim().toLowerCase() === 'hi') {
        this.conversationStarted = true;
        this.userInput = '';
        this.urbanService.getMenu().subscribe({
          next: (res) => {
            this.menuItems = res.menu_items;
            this.messages.push({ sender: 'bot', text: 'Hello! How can I help you today!' });
            this.menuItems.forEach((item: any) => {
              this.messages.push({ sender: 'bot', text: `${item.count}. ${item.name}` });
            });
            this.messages.push({ sender: 'bot', text: 'Reply with 1, 2, 3, 4... to continue!' });
          },
          error: () => {
            console.error('Error fetching menu items.');
          }
        });
      } else {
        this.messages.push({ sender: 'bot', text: 'Please type "hi" to start the urbanization shift prediction assistant.' });
      }
      this.userInput = '';
      return;
    }
  
    // Handle trend menu selection
    if (this.trendMenuActive) {
      const trendChoice = parseInt(this.userInput);
      this.userInput = '';
  
      if (trendChoice >= 1 && trendChoice <= 8) {
        this.trendMenuActive = false;
  
        switch (trendChoice) {
          case 1:
            this.showPopulationAndGreenCoverTrends();
            break;
          case 2:
            // this.showGenderDifferenceTrends();
            break;
          case 3:
            // this.showTopUrbanShiftPlaces();
            break;
          case 4:
            // this.showUrbanizationVsRoadDensity();
            break;
          case 5:
            // this.showNighttimeLightTrends();
            break;
          case 6:
            // this.showSlumAreaProportionTrends();
            break;
          case 7:
            // this.showLandUseChangeTrends();
            break;
          case 8:
            this.showMenu();
            break;
        }
      } else {
        this.messages.push({ sender: 'bot', text: 'Invalid selection. Please enter a number between 1 and 7.' });
        this.trendMenuActive = true;
      }
  
      return;
    }
  
    // Handle main menu selection
    const userChoice = parseInt(this.userInput);
    this.userInput = '';
  
    if (!isNaN(userChoice)) {
      this.userChoise = userChoice;
  
      switch (userChoice) {
        case 1:
          this.showTrendsMenu();
          break;
        case 2:
          this.showfaqMenu()
          break;
        case 3:
          // Handle other menu items
          break;
        default:
          this.messages.push({ sender: 'bot', text: 'Invalid menu option. Please select a valid number from the menu.' });
  this.sendMessage()  
          break;
      }
  
      return;
    }
  
   // Fallback for any unhandled input
  this.messages.push({ sender: 'bot', text: 'I didn’t understand that. Please reply with a valid number or say "hi" to restart.' });
  this.showMenu()
  }
  
  showfaqMenu() {
    const faqList = [
      {
        question: '1. What is urban shift detection?',
        answer: 'Urban shift detection refers to identifying and analyzing changes in land use, population density, infrastructure, and green cover that indicate urbanization or transformation of a region over time.'
      },
      {
        question: '2. How does this chatbot make predictions?',
        answer: 'The chatbot uses machine learning models trained on historical urban data. When you provide key inputs (like population density and green cover), it analyzes them to estimate the likelihood and nature of urban shifts in your area.'
      },
      {
        question: '3. What data do I need to provide for predictions?',
        answer: 'You’ll need to enter:\n- Population density\n- Green cover percentage\n- Road density\n- Nighttime light intensity\n- Number of nearby water bodies\nThese help the model understand urban patterns.'
      },
      {
        question: '4. Is my data saved or shared?',
        answer: 'No. Your data is only used during your session to generate a prediction. It is not stored, saved, or shared with any third party.'
      },
      {
        question: '5. How accurate are the predictions?',
        answer: 'Predictions are based on historical data and trained models. While they are generally reliable, they are estimates and should be used alongside other planning or research tools.'
      },
      {
        question: '6. What are common indicators of urban shift?',
        answer: 'Key indicators include:\n- Increased population density\n- Decrease in green areas\n- Rising road network density\n- Higher nighttime light intensity\n- Decline in water bodies or open land'
      },
      {
        question: '7. Can I view trends in my local area?',
        answer: 'At this stage, the chatbot provides general trend analysis based on aggregated data. Future updates may support localized analysis depending on available datasets.'
      },
      {
        question: '8. What do the graphs and charts mean?',
        answer: 'The charts visualize trends over time — such as changes in population vs. green cover — to help you understand how urban areas are evolving.'
      },
      {
        question: '9. How often is the model updated?',
        answer: 'The model is periodically updated based on new data and improvements in the algorithm. Updates aim to enhance accuracy and reflect more recent urban patterns.'
      },
      {
        question: '10. Who developed this chatbot and why?',
        answer: 'This chatbot was developed as part of a smart urban planning initiative to help users understand and anticipate urban growth using accessible AI tools.'
      }
    ];
  
    this.messages.push({ sender: 'bot', text: 'Here are some frequently asked questions:' });
  
    faqList.forEach(faq => {
      this.messages.push({ sender: 'bot', text: `${faq.question}\n${faq.answer}` });
    });
  
    this.messages.push({ sender: 'bot', text: 'Type "menu" to return to the main options.' });
  }
  

  showTrendsMenu() {
    this.trendMenuActive = true; // flag to tell sendMessage to expect trend input
    const trendOptions = [
      { id: 1, name: 'Population and Green Cover Trends' },
      { id: 2, name: 'Gender Difference Trends' },
      { id: 3, name: 'Top 5 Places with Most Detected Urban Shifts' },
      { id: 4, name: 'Urbanization vs Road Density Over Time' },
      { id: 5, name: 'Nighttime Light Intensity Trends' },
      { id: 6, name: 'Slum Area Proportion Trends by Zone' },
      { id: 7, name: 'Land Use Change Trends by Zoning Code' }
    ];

    this.messages.push({ sender: 'bot', text: 'Which trend analysis would you like to explore?' });

    trendOptions.forEach(option => {
      this.messages.push({ sender: 'bot', text: `${option.id}. ${option.name}` });
    });

    this.messages.push({ sender: 'bot', text: 'Reply with 1, 2, 3... to continue.' });
  }




  showMenu() {
    this.urbanService.getMenu().subscribe({
      next: (res) => {
        this.menuItems = res.menu_items;
        this.messages.push({ sender: 'bot', text: 'What would you like to do next?' });
        this.menuItems.forEach((item: any) => {
          this.messages.push({ sender: 'bot', text: `${item.count}. ${item.name}` });
        });
        this.messages.push({ sender: 'bot', text: 'Reply with 1, 2, 3... to continue.' });
      },
      error: () => {
        console.error('Failed to fetch menu');
      }
    });
  }


  async showPopulationAndGreenCoverTrends() {
    await this.urbanService.getTrends().subscribe({
      next: (res) => {
        this.messages.push({ sender: 'bot', type: 'chart' });
        this.showChart = true;
        this.cdr.detectChanges();

        // Wait for canvas to render, then draw chart
        setTimeout(() => {
          this.renderChart(res.data);
        }, 0);
      },
      error: (err) => console.error('Error fetching trends:', err),
    });
  }


  renderChart(trendData: any[]) {
    const years = trendData.map(item => item.year);
    const populations = trendData.map(item => item.average_population);
    const greenCovers = trendData.map(item => item.average_green_cover_percentage);

    setTimeout(() => {
      const canvases = this.trendChartsRef.toArray();
      const canvas = canvases[canvases.length - 1]?.nativeElement;

      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context not available');
        return;
      }

      if (this.chartInstance) this.chartInstance.destroy();

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Population',
              data: populations,
              borderColor: 'blue',
              tension: 0.3
            },
            {
              label: 'Green Cover %',
              data: greenCovers,
              borderColor: 'green',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Urban Trends Over Time'
            }
          }
        }
      });

      // 👇 Add this after chart renders
      setTimeout(() => {
        this.showMenu();
      }, 300); // slight delay to let chart render before menu comes

    }, 0);
  }



  getprediction() {
    // switch(this.messages)
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
