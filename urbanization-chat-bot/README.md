Perfect! Here's a clean and professional `README.md` for your **Angular Frontend (Urbanization Shift Chatbot UI)** that pairs with your FastAPI backend:

---

# 💬 Urbanization Shift Detection Chatbot (Angular)

An interactive chatbot interface built with Angular that communicates with a FastAPI backend to detect urbanization shift based on structured inputs like population density, green cover, and infrastructure indicators.

---

## 🚀 Features

- Conversational chatbot UI powered by Angular
- Interacts with FastAPI backend via HTTP
- Displays model predictions with confidence
- Input-guided conversations to simulate a user-bot flow
- Real-time UX with message animations and dynamic state

---

## 🛠️ Tech Stack

- **Angular** 17+
- **TypeScript**
- **RxJS**
- **Material UI** (optional)
- **FastAPI** backend (must be running separately)

---

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Serve the App

```bash
ng serve
```

Visit [http://localhost:4200](http://localhost:4200) in your browser.

> Make sure your FastAPI backend is running on `http://127.0.0.1:8000`

---

## 🔁 API Integration

The frontend communicates with the backend using Angular’s `HttpClient`.  
Make sure the service is configured correctly in `urbanization.service.ts`:

```ts
predictUrbanShift(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/predict`, data);
}
```

Also, don’t forget to include CORS middleware in the FastAPI backend to allow cross-origin requests.

---

## 💡 Example Interaction

1. The chatbot prompts the user to type `"hi"`
2. The bot sequentially asks for each input value (e.g., population density, etc.)
3. On completing input, it calls the prediction API and displays the result

---

## 📦 Build for Production

```bash
ng build --configuration=production
```

---

## 🧠 Backend Integration

Make sure the backend URL in your service matches the actual API:

```ts
private apiUrl = 'http://127.0.0.1:8000';
```

If deployed, update this to your hosted API endpoint.

---

## 🧪 Sample Test Data

You can generate prediction inputs using the following structure:

```ts
const dummyData = {
  population_density: 1500,
  green_cover_percentage: 35.5,
  road_density: 7.8,
  nighttime_light_intensity: 50.3,
  water_bodies_nearby: 3
};
```
