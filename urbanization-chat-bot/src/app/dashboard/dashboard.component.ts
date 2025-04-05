import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public urbanStats:any = {
    urbanGrowthRate: '3.2%',
    totalUrbanizedArea: '12,500 km²',
    populationShift: '8.1 million',
    greenAreaLoss: '6.7%'
  };
}
