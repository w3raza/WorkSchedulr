import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Project } from "src/app/shared/models/project.modal";

@Component({
  selector: "app-project-card",
  templateUrl: "./project-card.component.html",
  styleUrls: ["./project-card.component.css"],
})
export class ProjectCardComponent {
  @Input() project?: Project;

  @Input() backgroundStyle?: { [klass: string]: any };
  @Input() buttonStyle?: { [klass: string]: any };

  constructor(private router: Router) {}

  redirectToProjectInfo() {
    if (this.project && this.project.id) {
      this.router.navigate(["projects/", this.project.id]);
    }
  }
}
