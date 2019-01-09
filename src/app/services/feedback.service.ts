import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Observable } from 'rxjs';
import { Feedback } from '../shared/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService : ProcessHTTPMsgService) { }

  getFeedBack(): Observable<Feedback[]>{
  return this.http.get<Feedback[]>( baseURL + 'feedback')
  .pipe(catchError(this.processHTTPMsgService.handleError));
  }


  submitFeedback(feedback: Feedback): Observable<Feedback>{
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedback/',feedback, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  
  /*putFeedback(feedback : Feedback): Observable<Feedback>{
    console.log(feedback);
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    };
    return this.http.put<Feedback>(baseURL + 'feedback/', feedback, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }*/
}


