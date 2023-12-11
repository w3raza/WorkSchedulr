import { Component, Input } from "@angular/core";

@Component({
  selector: "app-no-data-message",
  templateUrl: "./no-data-message.component.html",
  styleUrls: [],
})
export class NoDataMessageComponent {
  @Input() message!: string;
}
