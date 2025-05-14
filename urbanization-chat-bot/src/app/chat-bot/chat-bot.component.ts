import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UrbanizationService, UrbanShiftInput } from '../service/urbanization.service';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http'; 
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
    water_bodies_nearby: null,
    Male_Count: null,
    Female_Count: null,
    Year: null,
    Slum_Area_Proportion: null,
    Place_Name: '',
    Land_Use_Type: '',
    Zoning_Code: ''
  };

  conversationStarted: boolean = false;
  menuItems: any;
  userChoise: any;
  trends: any;
  trendchoise: any;
  aichatactive: boolean = false;;


  constructor(private urbanService: UrbanizationService,
    private http: HttpClient,
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
    if (this.userInput.trim().toLowerCase() === 'menu') {
      this.showMenu();
      this.userInput = '';
      return;
    }


    this.messages.push({ sender: 'user', text: this.userInput });

    // Start conversation
    if (!this.conversationStarted) {
      if (this.userInput.trim().toLowerCase() === 'hi') {
        this.conversationStarted = true;
        this.userInput = '';
            this.menuItems = [
              { "count":"1","name": "Urban Trends Analysis", "url": "/trends" },
              {"count":"2","name": "FAQ / Expert Guidance", "url": "/about"},
              {"count":"3","name": "Predict", "url": "/predict"},
              {"count":"4","name": "Policy & Planning Insights", "url": "/policy"},
              {"count":"5","name":"Urban News Hub "},
          ];
            this.messages.push({ sender: 'bot', text: 'Hello! How can I help you today!' });
            this.menuItems.forEach((item: any) => {
              this.messages.push({ sender: 'bot', text: `${item.count}. ${item.name}` });
            });
            this.messages.push({ sender: 'bot', text: 'Reply with 1, 2, 3, 4... to continue!' })
      } else {
        this.messages.push({ sender: 'bot', text: 'Please type "hi" to start the urbanization shift prediction assistant.' });
      }
      this.userInput = '';
      return;
    }

    // Handle ongoing prediction input step-by-step
    if (this.conversationStep > 0 && this.conversationStep < 14) {
      this.getprediction();
      return;
    }

    while(this.aichatactive){
      this.fetchAIResponse();
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
            this.showGenderDifferenceTrends();
            break;
          case 3:
            this.urbanizationVsRoadDensityData();
            break;
          case 4:
            this.showNighttimeLightTrends();
            break;
          case 5:
            this.showSlumAreaTrends();
            break;
          case 6:
            this.showLandUseTrends();
            break;
          case 7:
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
          // Assuming you have a menu option for prediction
          this.startPrediction();
          break;
        case 4:
          this.showPolicyInsights(); // ✅ New Case
          break;
        case 5:
          this.fetchUrbanizationNews();
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

  showPolicyInsights() {
    this.messages.push({ sender: 'bot', text: '🔍 Generating policy and planning insights from trend data...' });
  
    // Insight 1: Slum Trends
    this.messages.push({
      sender: 'bot',
      text: '📉 *Slum Area Proportion:* Metro zones show a rising trend in slum area proportion. Consider implementing affordable housing schemes and upgrading urban services in underdeveloped wards.'
    });
  
    // Insight 2: Land Use
    this.messages.push({
      sender: 'bot',
      text: '🏙️ *Residential Land Use:* Tier 1 zones show reduced residential growth. It may indicate migration slowdowns or restrictive zoning laws needing revision.'
    });
  
    // Insight 3: Green Cover vs Population
    this.messages.push({
      sender: 'bot',
      text: '🌳 *Green Cover Decline:* A consistent drop in green space with a rise in population suggests urgent need for urban greening initiatives and protected zones.'
    });
  
    // Insight 4: Gender Ratio
    this.messages.push({
      sender: 'bot',
      text: '⚖️ *Gender Disparities:* Zones with widening male-to-female gaps could benefit from women-centric employment and safety initiatives.'
    });
  
    // Closing
    this.messages.push({
      sender: 'bot',
      text: '✅ These insights are generated from your urban data trends. Use them to guide strategic planning and development policy.'
    });
  }
  

  async showGenderDifferenceTrends() {
    await this.urbanService.getGenderData().subscribe(
      {
        next: (res) => {
          this.messages.push({ sender: 'bot', type: 'chart' });
          this.showChart = true;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.renderGenderChart(res.data);
          }, 0);
        },
        error: (err) => console.error('Error fetching trends:', err),
      }
    );
  }

  renderGenderChart(trendData: any[]) {
    const years = trendData.map(item => item.year);
    const malePopulations = trendData.map(item => item.avg_male_population);
    const femalePopulations = trendData.map(item => item.avg_female_population);
    const genderDifferences = trendData.map(item => item.gender_difference);

    setTimeout(() => {
      const canvases = this.trendChartsRef.toArray();
      const canvas = canvases[canvases.length - 1]?.nativeElement;

      if (!canvas) {
        console.error("Gender chart canvas not found");
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
              label: 'Male Population',
              data: malePopulations,
              borderColor: 'blue',
              yAxisID: 'y1',
              tension: 0.3,
              fill: false
            },
            {
              label: 'Female Population',
              data: femalePopulations,
              borderColor: 'pink',
              yAxisID: 'y1',
              tension: 0.3,
              fill: false
            },
            {
              label: 'Gender Difference',
              data: genderDifferences,
              borderColor: 'green',
              yAxisID: 'y2',
              tension: 0.3,
              fill: true,
              backgroundColor: 'rgba(0, 255, 0, 0.1)'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Gender Population Difference Over Time'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year'
              }
            },
            y1: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Population'
              }
            },
            y2: {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'Gender Difference'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });

      setTimeout(() => {
        this.showMenu(); // Optional menu logic after chart is rendered
      }, 300);
    }, 0);
  }

  async urbanizationVsRoadDensityData() {
    await this.urbanService.getUrbanvsroad().subscribe(
      {
        next: (res) => {
          this.messages.push({ sender: 'bot', type: 'chart' });
          this.showChart = true;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.renderUrbanizationVsRoadDensityChart(res.data);
          }, 0);
        },
        error: (err) => console.error('Error fetching Urbanization vs Road Density data:', err),
      }
    );
  }

  renderUrbanizationVsRoadDensityChart(urbanizationData: any[]) {
    const years = urbanizationData.map(item => item.year);
    const roadDensity = urbanizationData.map(item => item.average_road_density);
    const urbanizationShiftPercentage = urbanizationData.map(item => item.urbanization_shift_percentage);

    setTimeout(() => {
      const canvases = this.trendChartsRef.toArray(); // 👉 Make sure @ViewChildren is defined
      const canvas = canvases[canvases.length - 1]?.nativeElement;

      if (!canvas) {
        console.error("Dashboard chart canvas not found");
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context not available');
        return;
      }

      if (this.chartInstance) this.chartInstance.destroy();

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Road Density',
              data: roadDensity,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              yAxisID: 'y1',
              borderRadius: 5
            },
            {
              label: 'Urbanization Shift Percentage',
              data: urbanizationShiftPercentage,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              yAxisID: 'y2',
              borderRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Urbanization vs Road Density Over Time'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year'
              }
            },
            y1: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Road Density'
              }
            },
            y2: {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'Urbanization Shift Percentage'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });

      setTimeout(() => {
        this.showMenu(); // Optional UI trigger after chart is rendered
      }, 300);
    }, 0);
  }

  async showSlumAreaTrends() {
    await this.urbanService.getSlumAreaProportionTrends().subscribe({
      next: (res) => {
        this.messages.push({ sender: 'bot', type: 'chart' });
        this.showChart = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.renderSlumAreaChart(res.data);
        }, 0);
      },
      error: (err) => console.error('Error fetching slum trends:', err),
    });
  }

  renderSlumAreaChart(trendData: any[]) {
    const years = trendData.map(item => item.year);
    const metroData = trendData.map(item => item.zone_data?.["Metro"] ?? null);
    const tier1Data = trendData.map(item => item.zone_data?.["Tier 1"] ?? null);
    const tier2Data = trendData.map(item => item.zone_data?.["Tier 2"] ?? null);

    setTimeout(() => {
      const canvases = this.trendChartsRef.toArray();
      const canvas = canvases[canvases.length - 1]?.nativeElement;

      if (!canvas) {
        console.error("Slum chart canvas not found");
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
              label: 'Metro',
              data: metroData,
              borderColor: 'red',
              tension: 0.3,
              fill: false
            },
            {
              label: 'Tier 1',
              data: tier1Data,
              borderColor: 'blue',
              tension: 0.3,
              fill: false
            },
            {
              label: 'Tier 2',
              data: tier2Data,
              borderColor: 'orange',
              tension: 0.3,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Slum Area Proportion Trends by Urban Zone'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Slum Area Proportion (%)'
              },
              min: 0,
              max: 100
            }
          }
        }
      });

      setTimeout(() => {
        this.showMenu();
      }, 300);
    }, 0);
  }

  async showLandUseTrends() {
    await this.urbanService.getLandUseChangeTrends().subscribe({
      next: (res) => {
        this.messages.push({ sender: 'bot', type: 'chart' });
        this.showChart = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.renderLandUseChart(res.data);
        }, 0);
      },
      error: (err) => console.error('Error fetching land use trends:', err),
    });
  }

  renderLandUseChart(trendData: any[]) {
    const years = trendData.map(item => item.year);

    const metroData = trendData.map(item => item.zone_data?.["Metro"]?.["Residential"] ?? null);
    const tier1Data = trendData.map(item => item.zone_data?.["Tier 1"]?.["Residential"] ?? null);
    const tier2Data = trendData.map(item => item.zone_data?.["Tier 2"]?.["Residential"] ?? null);

    setTimeout(() => {
      const canvases = this.trendChartsRef.toArray();
      const canvas = canvases[canvases.length - 1]?.nativeElement;

      if (!canvas) {
        console.error("Land use chart canvas not found");
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
              label: 'Metro - Residential',
              data: metroData,
              borderColor: 'green',
              tension: 0.3,
              fill: false
            },
            {
              label: 'Tier 1 - Residential',
              data: tier1Data,
              borderColor: 'blue',
              tension: 0.3,
              fill: false
            },
            {
              label: 'Tier 2 - Residential',
              data: tier2Data,
              borderColor: 'purple',
              tension: 0.3,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Residential Land Use Trends by Zoning Code'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Reported Land Use Frequency'
              },
              min: 0
            }
          }
        }
      });

      setTimeout(() => {
        this.showMenu();
      }, 300);
    }, 0);
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
      { id: 3, name: 'Urbanization vs Road Density Over Time' },
      { id: 4, name: 'Nighttime Light Intensity Trends' },
      { id: 5, name: 'Slum Area Proportion Trends by Zone' },
      { id: 6, name: 'Land Use Change Trends by Zoning Code' }
    ];

    this.messages.push({ sender: 'bot', text: 'Which trend analysis would you like to explore?' });

    trendOptions.forEach(option => {
      this.messages.push({ sender: 'bot', text: `${option.id}. ${option.name}` });
    });

    this.messages.push({ sender: 'bot', text: 'Reply with 1, 2, 3... to continue.' });
  }

  showMenu() {
            this.menuItems = [
              { "count":"1","name": "Urban Trends Analysis", "url": "/trends" },
              {"count":"2","name": "FAQ / Expert Guidance", "url": "/about"},
              {"count":"3","name": "Predict", "url": "/predict"},
              {"count":"4","name": "Policy & Planning Insights", "url": "/policy"},
              {"count":"5","name":"Urban News Hub "}
          ];
            this.menuItems.forEach((item: any) => {
              this.messages.push({ sender: 'bot', text: `${item.count}. ${item.name}` });
            });
            this.messages.push({ sender: 'bot', text: 'Reply with 1, 2, 3, 4... to continue!' })
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

  async showNighttimeLightTrends() {
    await this.urbanService.getNightLight().subscribe({
      next: (res) => {
        this.messages.push({ sender: 'bot', type: 'chart' });
        this.showChart = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.renderNighttimeLightChart(res.data);
        }, 0);
      },
      error: (err) => console.error('Error fetching nighttime light trends:', err),
    });
  }

  renderNighttimeLightChart(data: any[]) {
    const years = data.map(item => item.year);
    const intensities = data.map(item => item.average_nighttime_light_intensity);

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
              label: 'Avg Nighttime Light Intensity',
              data: intensities,
              borderColor: 'orange',
              backgroundColor: 'rgba(255, 165, 0, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Nighttime Light Intensity Trends'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Light Intensity'
              }
            }
          }
        }
      });

      // 👇 Optional post-render UI update
      setTimeout(() => {
        this.showMenu();
      }, 300);
    }, 0);
  }


  startPrediction() {
    this.messages.push({ sender: 'bot', text: 'Let\'s start the urban shift prediction process.' });
    this.conversationStep = 1;
    this.getprediction(); // ✅ Only call once, not in a while-loop!
  }

  getprediction() {

    // Handle different steps based on conversationStep
    if (this.conversationStep === 1) {
      this.messages.push({
        sender: 'bot',
        text: 'What is the population density of the area? (e.g., 5200 people per square km)'
      });
    } else if (this.conversationStep === 2) {
      this.userData.population_density = parseFloat(this.userInput);
      this.messages.push({
        sender: 'bot',
        text: 'Got it. What is the green cover percentage? (e.g., 23.5%)'
      });
    } else if (this.conversationStep === 3) {
      this.userData.green_cover_percentage = parseFloat(this.userInput);
      this.messages.push({
        sender: 'bot',
        text: 'Thanks. What is the road density? (e.g., 2.8 km of road per sq km)'
      });
    } else if (this.conversationStep === 4) {
      this.userData.road_density = parseFloat(this.userInput);
      this.messages.push({
        sender: 'bot',
        text: 'Noted. What is the nighttime light intensity? (e.g., 35.6 — higher means more urban activity)'
      });
    } else if (this.conversationStep === 5) {
      this.userData.nighttime_light_intensity = parseFloat(this.userInput);
      this.messages.push({
        sender: 'bot',
        text: 'Almost done. How many water bodies are nearby? (e.g., 3 lakes/rivers/ponds)'
      });
    } else if (this.conversationStep === 6) {
      this.userData.water_bodies_nearby = parseInt(this.userInput);
      this.messages.push({
        sender: 'bot',
        text: 'What is the Male population count? (e.g., 13400)'
      });
    } else if (this.conversationStep === 7) {
      this.userData.Male_Count = parseInt(this.userInput);
      this.messages.push({
        sender: 'bot',
        text: 'What is the Female population count? (e.g., 12700)'
      });
    } else if (this.conversationStep === 8) {
      this.userData.Female_Count = parseInt(this.userInput);
      this.messages.push({
        sender: 'bot',
        text: 'What year are you analyzing for? (e.g., 2022)'
      });
    } else if (this.conversationStep === 9) {
      this.userData.Year = parseInt(this.userInput);
      this.messages.push({
        sender: 'bot',
        text: 'What is the Slum Area Proportion (%)? (e.g., 12.4)'
      });
    } else if (this.conversationStep === 10) {
      this.userData.Slum_Area_Proportion = parseFloat(this.userInput);
      this.messages.push({
        sender: 'bot',
        text: 'What is the name of the place? (e.g., Andheri East)'
      });
    } else if (this.conversationStep === 11) {
      this.userData.Place_Name = this.userInput.trim();
      this.messages.push({
        sender: 'bot',
        text: 'What is the Land Use Type? (e.g., Residential, Industrial, Commercial, Mixed)'
      });
    } else if (this.conversationStep === 12) {
      this.userData.Land_Use_Type = this.userInput.trim();
      this.messages.push({
        sender: 'bot',
        text: 'What is the Zoning Code or Urban Tier? (e.g., R1, C3, Tier-2)'
      });
    } else if (this.conversationStep === 13) {
      this.userData.Zoning_Code = this.userInput.trim();
      this.messages.push({
        sender: 'bot',
        text: 'Thanks! Predicting urbanization shift... 🔍'
      });

      this.urbanService.predictUrbanShift(this.userData).subscribe({
        next: (response) => {
          this.messages.push({ sender: 'bot', text: `Prediction: ${response.status}` });
          this.messages.push({ sender: 'bot', text: `Confidence: ${response.confidence_percent}%` });
        },
        error: () => {
          this.messages.push({ sender: 'bot', text: 'Oops! Prediction failed. Please try again later.' });
        }
      });

      this.conversationStep = 0;
      this.conversationStarted = false;
      this.userData = {};
      return;
    }
    this.conversationStep++;
    this.userInput = '';

  }

  articles: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  async fetchUrbanizationNews() {
    // Show a loading message
    this.messages.push({ sender: 'bot', text: '🔍 Generating policy and planning insights from trend data...' });
    
    // Set loading state
    this.isLoading = true;
  
    // Fetch news from the service
   await this.urbanService.getUrbanizationNews().subscribe({
      next: (data) => {
        // Push each article as a message
        this.messages.push({ sender: 'bot', text: 'Here are the latest insights on urbanization:' });
  
        // Add each article to the messages array
        data.articles.forEach((article: any) => {
          this.messages.push({
            sender: 'bot',
            text: `${article.title} - ${article.description}\nRead more: ${article.url}`
          });
        });
  
        this.isLoading = false;
        this.showMenu();
      },
      error: (err) => {
        // Handle errors if the request fails
        this.errorMessage = 'Failed to load news. Please try again later.';
        this.messages.push({ sender: 'bot', text: this.errorMessage });
        this.isLoading = false;
        this.showMenu();
      }
    });
  }

  async fetchAIResponse(): Promise<void> {
    // Display prompt and wait for user input
    this.messages.push({ sender: 'bot', text: 'Ask AI anything!' });
  
    // Wait until the AI feature is active before proceeding
    if (!this.aichatactive) {
      this.messages.push({ sender: 'bot', text: 'Please wait, AI chat is currently inactive.' });
      return;
    }
  
    const input = this.userInput;
    this.userInput = ''; // Clear user input after storing it
  
    console.log(input);  // Debugging the input
  
    // If user input is valid, proceed with AI response fetching
    if (input && input.trim() !== '') {
      this.isLoading = true;
  
      try {
        // Make the HTTP POST request and wait for the response
        const response = await this.http.post<any>('http://localhost:8000/chat', { user_input: input }).toPromise();
        
        // Once we get the response, update the messages
        this.messages.push({ sender: 'user', text: input });  // Display user's input
        this.messages.push({ sender: 'bot', text: response.response });  // Display bot's response
      } catch (err) {
        // If there is an error, show the error message
        this.errorMessage = 'Failed to get AI response. Please try again later.';
        this.messages.push({ sender: 'bot', text: this.errorMessage });
      } finally {
        this.isLoading = false;  // Reset loading state after receiving response
      }
    } else {
      // If user input is empty, prompt the user to type something
      this.messages.push({ sender: 'bot', text: 'Please enter a valid question or input.' });
      return;
    }
  
    // Clear the input field after submission
    this.userInput = '';
  }
  
  
}
