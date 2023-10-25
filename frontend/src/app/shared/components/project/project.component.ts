import { Component, OnInit } from "@angular/core";
import { Project } from "../../models/project.modal";
import { ProjectService } from "../../services/project.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"],
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.projectService.fetchProjects().subscribe((data) => {
      this.projects = [...data.content];
    });
  }
}
