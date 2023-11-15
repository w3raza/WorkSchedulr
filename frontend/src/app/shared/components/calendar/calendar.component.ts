import {
  Component,
  signal,
  ChangeDetectorRef,
  ViewContainerRef,
} from "@angular/core";
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { INITIAL_EVENTS } from "./event-utils";
import { CalendarEventService } from "../../services/calendarEvent.service";
import { AuthHelper } from "../../helper/auth.helper";
import { EventComponent } from "./event/event.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent {
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialView: "timeGridDay",
    initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(
    private authHelper: AuthHelper,
    private changeDetector: ChangeDetectorRef,
    private calendarEventService: CalendarEventService,
    public dialog: MatDialog
  ) {}

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.mutate((options) => {
      options.weekends = !options.weekends;
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(EventComponent, {
      width: "400px",
      height: "350px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      const calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();

      const user = this.authHelper.getCurrentUser();

      if (result) {
        const newEvent = {
          id: null,
          title: result.title,
          startTime: selectInfo.startStr,
          endTime: selectInfo.endStr,
          project: result.project,
          owner: user,
        };

        this.calendarEventService.createEvent(newEvent).subscribe({
          next: (event) => {
            calendarApi.addEvent(event);
          },
        });
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    const userId = this.authHelper.getCurrentUserId();
    console.log("userId " + userId);
    if (userId) {
      this.loadEventsForUser(userId);
    }
  }

  loadEventsForUser(userId: string) {
    this.calendarEventService.getEvents(userId).subscribe({
      next: (events) => {
        this.calendarOptions.mutate((options) => {
          options.events = events;
        });
      },
    });
  }
}
