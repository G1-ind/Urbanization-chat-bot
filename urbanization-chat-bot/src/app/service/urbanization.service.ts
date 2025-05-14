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

  getSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary-profile`);
  }

  getSlumAreaProportionTrends(): Observable<any> {
    return this.http.get(`${this.apiUrl}/slum-area-proportion-trends`);
  }

  getLandUseChangeTrends(): Observable<any> {
    return this.http.get(`${this.apiUrl}/land-use-change-trends`);
  }

  private apiKey = '96128d509cec4ce4a9dac45d8d790d44'; // Replace with your API key
  private apiUrls = 'https://newsapi.org/v2/everything'; // API endpoint for NewsAPI

  getUrbanizationNews(): Observable<any> {
    const queryParams = {
      q: 'urbanization OR "smart cities" OR "city planning" OR "population growth"',
      apiKey: this.apiKey,
      language: 'en', // Optional, filter by language
      sortBy: 'publishedAt', // Optional, order by latest
    };

    return this.http.get<any>(this.apiUrls, { params: queryParams });
  }
  
  
  
}
