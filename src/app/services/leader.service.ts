import { Injectable } from '@angular/core';
import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { catchError, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService)
   { }

   getLeaders(): Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leaders')
    .pipe(catchError(this.processHTTPMsgService.handleError));
   }

   getLeader(id: string): Observable<Leader>{
    return this.http.get<Leader>( baseURL + 'leader/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
   }

   getFeaturedLeader() : Observable<Leader>{
     return this.http.get<Leader[]>( baseURL + 'leaders?featured=true')
     .pipe(map(leaders => leaders[0]))
     .pipe(catchError(this.processHTTPMsgService.handleError));
   }

   getLeaderIds() : Observable< string | any>{
     return this.getLeaders().pipe(map( leaders => leaders.map(leader => leader.id)))
     .pipe(catchError( error => error));
   }

   putLeader(leader: Leader) : Observable<Leader>{
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      return this.http.put<Leader>(baseURL + 'Leaders/' + leader.id, leader, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
   }
  }
