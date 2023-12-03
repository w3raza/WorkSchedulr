import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Bill } from "../models/bill.modal";

@Injectable({
  providedIn: "root",
})
export class BillService {
  private readonly url = environment.apiUrl;
  private readonly API_ENDPOINTS = {
    BILL: `${this.url}/bill`,
  };

  constructor(private http: HttpClient) {}

  getBills(
    userId: string | null,
    start: string,
    end: string
  ): Observable<Bill[]> {
    let url = `${this.API_ENDPOINTS.BILL}?start=${start}&end=${end}`;

    if (userId) {
      url += `&userId=${userId}`;
    }

    return this.http.get<Bill[]>(url);
  }

  downloadBillFile(id: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.API_ENDPOINTS.BILL}/${id}`, {
      responseType: "blob" as "json",
    });
  }

  regenerateBill(id: string): Observable<string> {
    return this.http.get<string>(
      `${this.API_ENDPOINTS.BILL}/regenerate/${id}`,
      {
        responseType: "text" as "json",
      }
    );
  }
}
