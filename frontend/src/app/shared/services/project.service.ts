import { Injectable } from "@angular/core";
import { Project } from "../models/project.modal";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PageProperties, Response } from "../models/page.modal";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private readonly BASE_URL = environment.apiUrl;
  private readonly API_ENDPOINTS = {
    PROJECT: `${this.BASE_URL}/project`,
  };
  constructor(private http: HttpClient) {}

  fetchProjects(
    userId: string | null,
    status: boolean | null,
    title: string | null,
    page: number
  ): Observable<Response<Project>> {
    let url = `${this.API_ENDPOINTS.PROJECT}?page=${page}`;

    if (userId !== null) {
      url += `&userId=${userId}`;
    }

    if (status !== null) {
      url += `&status=${status}`;
    }

    if (title !== null) {
      url += `&title=${title}`;
    }

    return this.http.get<Response<Project>>(url);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.API_ENDPOINTS.PROJECT}`, project);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.patch<Project>(`${this.API_ENDPOINTS.PROJECT}`, project);
  }

  deleteProject(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_ENDPOINTS.PROJECT}?id=${id}`, {
      responseType: "text" as "json",
    });
  }
}
