import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-project-info",
  templateUrl: "./project-info.component.html",
  styleUrls: ["./project-info.component.css"],
})
export class ProjectInfoComponent {
  constructor(private router: Router) {}
  backToList(): void {
    this.router.navigate(["/projects"]);
  }
}
