import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stats-card',
  imports: [MatCardModule,MatIconModule],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss'
})
export class StatsCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() icon!: string;

}
