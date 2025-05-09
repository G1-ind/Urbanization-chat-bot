import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StatsCardComponent } from '../components/stats-card/stats-card.component';
import { MatIconModule } from '@angular/material/icon';
import { UrbanizationService } from '../service/urbanization.service';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule,CommonModule,StatsCardComponent,MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  @ViewChild('dashboardChart', { static: true }) dashboardChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dashboardgenderChart', { static: true }) dashboardgenderChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dashboardUrbanizationVsRoadDensityChart', { static: true }) dashboardUrbanizationVsRoadDensityChart!: ElementRef<HTMLCanvasElement>;

  statsData: any[] = [];
  chartInstance: any;
  chartgenderInstance:any
  chartUrbanizationVsRoadDensityInstance: any;

  constructor(
    private urbanService: UrbanizationService,
    private cdr: ChangeDetectorRef
  ) { 
  }
  ngOnInit(): void {
    this.showPopulationAndGreenCoverTrends(); 
    this.genderPopulationData();
    this.stats();
    this.urbanizationVsRoadDensityData();
  }

  stats(){
    const data = {
      population_density: 1200.5,
      green_cover_percentage: 35.7,
      road_density: 200.3,
      nighttime_light_intensity: 150.4,
      water_bodies_nearby: 5.2,
      Male_Count: 3500,
      Female_Count: 3400,
      Year: 2024,
      Slum_Area_Proportion: 20.5,
      Place_Name: 'Urban Area A',
      Land_Use_Type: 'Residential',
      Zoning_Code: 'R1'
    };

    // Mapping data to statsData array
    this.statsData = [
      {
        title: 'Population Density (per km²)',
        value: data.population_density.toFixed(2),
        icon: 'density_large', // Example icon
      },
      {
        title: 'Green Cover %',
        value: data.green_cover_percentage.toFixed(2),
        icon: 'eco', // Example icon
      },
      {
        title: 'Road Density (per km²)',
        value: data.road_density.toFixed(2),
        icon: 'directions_car', // Example icon
      },
      {
        title: 'Nighttime Light Intensity',
        value: data.nighttime_light_intensity.toFixed(2),
        icon: 'light_mode', // Example icon
      },
      {
        title: 'Water Bodies Nearby (km²)',
        value: data.water_bodies_nearby.toFixed(2),
        icon: 'water_drop', // Example icon
      },
      {
        title: 'Slum Area Proportion %',
        value: data.Slum_Area_Proportion.toFixed(2),
        icon: 'home_work', // Example icon
      },
      {
        title: 'Male Population',
        value: data.Male_Count.toString(),
        icon: 'male', // Example icon
      },
      {
        title: 'Female Population',
        value: data.Female_Count.toString(),
        icon: 'female', // Example icon
      },
    ];
  }

  async genderPopulationData(){
    await this.urbanService.getGenderData().subscribe(
      {
        next: (res) => {
          this.cdr.detectChanges();
    
          setTimeout(() => {
            this.renderGenderChart(res.data);
          }, 0);
        },
        error: (err) => console.error('Error fetching trends:', err),
      }
    );
  }

  renderGenderChart(trendData:any[]){
    const years = trendData.map(item => item.year);
    const malePopulations = trendData.map(item => item.avg_male_population);
    const femalePopulations = trendData.map(item => item.avg_female_population);
    const genderDifferences = trendData.map(item => item.gender_difference);

    const canvas = this.dashboardgenderChart?.nativeElement;
    if (!canvas) {
      console.error("Dashboard chart canvas not found");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    if (this.chartgenderInstance) this.chartgenderInstance.destroy();

    this.chartgenderInstance = new Chart(ctx, {
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
              drawOnChartArea: false  // Hide grid lines for second Y-axis
            }
          }
        }
      }
    });
  }

  async urbanizationVsRoadDensityData() {
    await this.urbanService.getUrbanvsroad().subscribe(
      {
        next: (res) => {
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
  
    const canvas = this.dashboardUrbanizationVsRoadDensityChart?.nativeElement;
    if (!canvas) {
      console.error("Dashboard chart canvas not found");
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }
  
    if (this.chartUrbanizationVsRoadDensityInstance) this.chartUrbanizationVsRoadDensityInstance.destroy();
  
    this.chartUrbanizationVsRoadDensityInstance = new Chart(ctx, {
      type: 'bar',  // Changed chart type to 'bar'
      data: {
        labels: years,
        datasets: [
          {
            label: 'Road Density',
            data: roadDensity,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',  // Blue bars
            yAxisID: 'y1',
            borderRadius: 5,  // Rounded corners for bars
          },
          {
            label: 'Urbanization Shift Percentage',
            data: urbanizationShiftPercentage,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',  // Red bars
            yAxisID: 'y2',
            borderRadius: 5,  // Rounded corners for bars
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
              drawOnChartArea: false  // Hide grid lines for second Y-axis
            }
          }
        }
      }
    });
  }
  
  async showPopulationAndGreenCoverTrends() {
    await this.urbanService.getTrends().subscribe({
      next: (res) => {
        this.cdr.detectChanges();
  
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
  
    const canvas = this.dashboardChartRef?.nativeElement;
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
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Population',
            data: populations,
            borderColor: 'blue',
            yAxisID: 'y1',
            tension: 0.3
          },
          {
            label: 'Green Cover %',
            data: greenCovers,
            borderColor: 'green',
            yAxisID: 'y2',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Population vs Green Cover Over Time'
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
            position: 'left',  // 👈 Population axis on left
            title: {
              display: true,
              text: 'Population'
            }
          },
          y2: {
            type: 'linear',
            position: 'right', // 👈 Green Cover axis on right
            title: {
              display: true,
              text: 'Green Cover %'
            },
            grid: {
              drawOnChartArea: false  // Optional: hide grid lines for second Y axis
            }
          }
        }
      }
    });
  }
  
}
  
