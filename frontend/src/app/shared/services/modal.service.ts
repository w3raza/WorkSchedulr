import {
  Injectable,
  ComponentRef,
  Injector,
  ViewContainerRef,
} from "@angular/core";
import { EventComponent } from "../components/calendar/event/event.component";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  private viewContainerRef!: ViewContainerRef;
  private modalComponentRef!: ComponentRef<EventComponent>;

  constructor() {}

  // This method needs to be called once, set the viewContainerRef
  public setViewContainerRef(vcr: ViewContainerRef) {
    this.viewContainerRef = vcr;
  }

  public openModal(modalComponent: any): Promise<any> {
    // Cast the component reference to the ModalComponent type
    const componentRef = this.viewContainerRef.createComponent(
      modalComponent
    ) as ComponentRef<EventComponent>;
    this.modalComponentRef = componentRef;

    return new Promise((resolve, reject) => {
      // Now TypeScript knows that 'instance' has 'close' and 'submit' properties
      componentRef.instance.close.subscribe(() => {
        this.closeModal();
        reject(new Error("Modal closed without submission"));
      });

      componentRef.instance.submit.subscribe((data: any) => {
        this.closeModal();
        resolve(data);
      });
    });
  }

  public closeModal(): void {
    this.modalComponentRef.destroy();
  }
}
