import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiserviceService {
    constructor(private http: HttpClient) { }
    newdata:any;
    getConfig(state: String): Observable<any> {
        return this.http.get('http://127.0.0.1:5000/state/'+state);
    }
    getType(state: String, type: number): Observable<any> {
        return this.http.get('http://127.0.0.1:5000/state/'+state+"/"+type);
    }
    getFuture(state: String, type: number): Observable<any> {
        return this.http.get('http://127.0.0.1:5000/predict/'+state+"/"+type);
    }
}
