import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UrbanShiftInput {
  population_density: number;
  green_cover_percentage: number;
  road_density: number;
  nighttime_light_intensity: number;
  water_bodies_nearby: number;
}

export interface UrbanShiftResponse {
  status: string;
  confidence_percent: number;
  interpretation: string;
  input_summary: UrbanShiftInput;
}

@Injectable({
  providedIn: 'root'
})
export class UrbanizationService {
  private apiUrl = 'http://127.0.0.1:8000'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  predictUrbanShift(data: UrbanShiftInput): Observable<UrbanShiftResponse> {
    return this.http.post<UrbanShiftResponse>(`${this.apiUrl}/predict`, data);
  }

  getMenu(): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu`);
  }

  getTrends(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trends`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getGenderData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gender-diff-trends`);
  }

  getUrbanvsroad(): Observable<any> {
    return this.http.get(`${this.apiUrl}/urbanization-vs-road-density`);
  }

  getNightLight(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nighttime-intensity-trends`);
  }
}
