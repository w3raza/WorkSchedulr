import { Component, signal, ChangeDetectorRef } from "@angular/core";
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
import { CalendarEvent } from "../../models/calendar-event.model";
import { CalendarHelper } from "../../helper/calendar.helper";
import { Project } from "../../models/project.modal";
import { ProjectService } from "../../services/project.service";

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

  projects: Project[] = [];
  projectsId: Array<string> = [];
  userId: string | null = null;

  constructor(
    private authHelper: AuthHelper,
    private projectService: ProjectService,
    private changeDetector: ChangeDetectorRef,
    private calendarEventService: CalendarEventService,
    public dialog: MatDialog
  ) {
    this.fetchEvents();

    if (!this.authHelper.checkIsAdmin()) {
      this.userId = this.authHelper.getCurrentUserId();
    }
    this.getAllProjectsForUser();
  }

  fetchEvents(): void {
    const userId = this.authHelper.getCurrentUserId();
    this.calendarEventService.getEvents(userId).subscribe({
      next: (events: CalendarEvent[]) => {
        const fullCalendarEvents = events.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.startTime,
          end: event.endTime,
          allDay: false,
          backgroundColor: CalendarHelper.setColor(
            event.project.id,
            this.projectsId
          ),
        }));
        this.calendarOptions.mutate((options) => {
          options.events = fullCalendarEvents;
        });
      },
    });
  }

  private getAllProjectsForUser(): void {
    this.projectService
      .fetchProjects(this.userId, null, null, 0)
      .subscribe((data) => {
        this.projects = [...data.content];
        this.projectsId = this.projects?.map((project) => project.id);
      });
  }

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
      data: { projects: this.projects },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const calendarApi = selectInfo.view.calendar;

      const user = this.authHelper.getCurrentUser();
      if (result && user) {
        const newEvent = new CalendarEvent(
          "",
          result.description,
          selectInfo.start,
          selectInfo.end,
          result.project,
          user
        );

        this.calendarEventService.createEvent(newEvent).subscribe((event) => {
          console.log(event);
          calendarApi.addEvent(event, true);
        });
      }
      calendarApi.unselect();
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
}
