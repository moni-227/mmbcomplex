import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  private apiUrl = 'https://mmb-hostel.onrender.com/api/auth/login'; // Backend API URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams().set('username', username).set('password', password);
    
    return this.http.get<any>(this.apiUrl, { params });
  }
  private getuser = 'https://mmb-hostel.onrender.com/api/auth'; // Backend API URL


  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.getuser);
  }


  private booking = 'https://mmb-hostel.onrender.com/api'; // Backend API URL


  // Method to create a new booking
  createBooking(bookingData: any): Observable<any> {
    return this.http.post<any>(`${this.booking}/book`, bookingData);
  }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.booking}/bookings`);
  }
  
  getBookingById(bookingId: string): Observable<any> {
    return this.http.get(`${this.booking}/booking/${bookingId}`);
  }

  // Update booking details
  updateBooking(bookingId: string, bookingData: any): Observable<any> {
    return this.http.put(`${this.booking}/booking/${bookingId}`, bookingData);
  }


  deleteBooking(bookingId: string): Observable<any> {
    return this.http.delete(`${this.booking}/booking/${bookingId}`);
  }


  private payment = 'https://mmb-hostel.onrender.com/api/payments'; // Change this if needed


  // Add Payment
  addPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.payment}`, paymentData);
  }

  // Get All Payments
  getAllPayments(): Observable<any[]> {
    return this.http.get<string[]>(`${this.payment}`);
  }

  // Get Payment by ID
  getPaymentById(id: any): Observable<any> {
    return this.http.get<string>(`${this.payment}/${id}`);
  }

  // Update Payment
  updatePayment(id: any, paymentData: any): Observable<any> {
    return this.http.put(`${this.payment}/${id}`, paymentData);
  }

  // Delete Payment
  deletePayment(id: any): Observable<any> {
    return this.http.delete(`${this.payment}/${id}`);
  }
  private dash = 'https://mmb-hostel.onrender.com/api/dashboard';


  getDashboardData(): Observable<any> {
    return this.http.get<any>(this.dash);
  }

  private dashs = 'https://mmb-hostel.onrender.com/api/getRentAndAdvanceData';

  getRentAndAdvanceData(): Observable<any> {
    return this.http.get<any>(`${this.dashs}`);
  }
  private missing = 'https://mmb-hostel.onrender.com/api/missing'; // Change this to your backend URL


  // Function to get missing bookings
  getMissingBookings(): Observable<any> {
    return this.http.get<any>(this.missing);
  }


  
}
