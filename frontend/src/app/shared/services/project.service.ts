import { Injectable } from "@angular/core";
import { Project } from "../models/project.modal";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PageProperties } from "../models/page.modal";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private readonly BASE_URL = environment.apiUrl;
  private readonly API_ENDPOINTS = {
    PROJECT: `${this.BASE_URL}/project`,
  };
  constructor(private http: HttpClient) {}

  fetchProjects(): Observable<{
    content: Project[];
    properties: PageProperties;
  }> {
    return this.http.get<{ content: Project[]; properties: PageProperties }>(
      `${this.API_ENDPOINTS.PROJECT}`
    );
  }
}
