import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Project } from "../models/project.modal";

@Injectable({
  providedIn: "root",
})
export class ProjectDataService {
  private projectSource = new BehaviorSubject<Project | null>(null);
  currentProject = this.projectSource.asObservable();

  constructor() {}

  changeProject(project: Project) {
    this.projectSource.next(project);
  }
}
