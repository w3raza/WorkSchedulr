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

  formatDate(dateArray?: number[]): string {
    if (dateArray && dateArray.length >= 6) {
      const date = new Date(
        dateArray[0],
        dateArray[1] - 1,
        dateArray[2],
        dateArray[3],
        dateArray[4],
        dateArray[5]
      );
      return `${this.padZero(date.getHours())}:${this.padZero(
        date.getMinutes()
      )} ${this.padZero(date.getDate())}/${this.padZero(
        date.getMonth() + 1
      )}/${date.getFullYear()}`;
    }
    return "";
  }

  private padZero(num: number): string {
    return num < 10 ? "0" + num : "" + num;
  }
}
