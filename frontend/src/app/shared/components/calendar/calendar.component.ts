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
import { CalendarEventService } from "../../services/calendarEvent.service";
import { AuthHelper } from "../../helper/auth.helper";
import { EventComponent } from "./event/event.component";
import { MatDialog } from "@angular/material/dialog";
import { CalendarEvent } from "../../models/calendar-event.model";
import { CalendarHelper } from "../../helper/calendar.helper";
import { Project } from "../../models/project.modal";
import { ProjectService } from "../../services/project.service";
import { EventImpl } from "@fullcalendar/core/internal";
import { NotificationService } from "../../services/notification.service";
import { Observable } from "rxjs";

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
    allDaySlot: false,
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
  projectNameInfo: string = ", ProjectName: ";

  constructor(
    private authHelper: AuthHelper,
    private projectService: ProjectService,
    private changeDetector: ChangeDetectorRef,
    private calendarEventService: CalendarEventService,
    private notification: NotificationService,
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
          ...event,
          backgroundColor: CalendarHelper.setColor(
            event.project.id,
            this.projectsId
          ),
          title: `${
            event.title.split(this.projectNameInfo)[0]
          }${this.getProjectName(event)}`,
          extendedProps: {
            projectId: event.project.id,
          },
        }));
        this.calendarOptions.mutate((options) => {
          options.events = fullCalendarEvents;
        });
      },
    });
  }

  getProjectName(calendar: CalendarEvent): string {
    return this.projectNameInfo + calendar.project.title;
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
          calendarApi.addEvent(event, true);
        });
      }
      calendarApi.unselect();
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const dialogRef = this.dialog.open(EventComponent, {
      width: "400px",
      height: "350px",
      data: {
        projects: this.projects,
        event: {
          id: clickInfo.event.id,
          title: clickInfo.event.title,
          project: this.getProjectFromEvent(clickInfo.event),
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.delete) {
          this.deleteEvent(result.id).subscribe((note) => {
            if (note) {
              this.notification.showSuccess(note);
            }
          });
          clickInfo.event.remove();
        } else {
          this.updateEvent(result).subscribe((updatedEvent) => {
            if (updatedEvent) {
              this.notification.showSuccess("Event updated");
            }
          });
        }
      }
    });
  }

  private updateEvent(calendarEvent: CalendarEvent): Observable<CalendarEvent> {
    return this.calendarEventService.updateEvent(calendarEvent);
  }

  private deleteEvent(id: string): Observable<string> {
    return this.calendarEventService.deleteEvent(id);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  private getProjectFromEvent(event: EventImpl): Project | undefined {
    const projectId = event.extendedProps["projectId"];
    return this.projects.find((p) => p.id === projectId);
  }
}
