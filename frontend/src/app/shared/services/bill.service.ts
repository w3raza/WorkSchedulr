import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
    page: number,
    size: number
  ): Observable<Bill[]> {
    let url = `${this.API_ENDPOINTS.BILL}?page=${page}&size=${size}`;

    if (userId) {
      url += `?userId=${userId}`;
    }
    return this.http.get<Bill[]>(url);
  }

  downloadBillFile(id: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.API_ENDPOINTS.BILL}/${id}`);
  }

  regenerateBill(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Observable<string> {
    return this.http.post<string>(
      `${this.API_ENDPOINTS.BILL}/regenerate?userId=${userId}&start=${startDate}&end=${endDate}`,
      {
        responseType: "text" as "json",
      }
    );
  }
}
