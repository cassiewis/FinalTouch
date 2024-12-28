import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/api/contact/send'; // Your backend URL

  constructor(private http: HttpClient) {}

  sendContactEmail(contactData: any): Observable<any> {
    return this.http.post(this.apiUrl, contactData);
  }
}
