import { Component, HostListener } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title: string = "Work Scheduler";

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    localStorage.clear();
  }
}
