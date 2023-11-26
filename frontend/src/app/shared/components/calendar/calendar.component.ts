import {
  Component,
  signal,
  ChangeDetectorRef,
  ViewEncapsulation,
} from "@angular/core";
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventChangeArg,
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
import { User } from "../../models/user.model";
import { UserRole } from "../../enums/user-role.enum";
import { IdNameDTO } from "../../models/IdNameDTO.modal";
import { UserHelper } from "../../helper/user.helper";
import { UserService } from "../../services/user.service";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
  encapsulation: ViewEncapsulation.None,
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
    // eventAdd:
    eventChange: this.handleEventChange.bind(this),
    // eventRemove:
  });
  currentEvents = signal<EventApi[]>([]);

  projects: Project[] = [];
  projectsId: string[] = [];
  projectNameInfo: string = ", ProjectName: ";

  role: typeof UserRole = UserRole;
  userIdNameDTOs: IdNameDTO[] = [];
  users: User[] = [];
  user: User | null = null;

  constructor(
    private authHelper: AuthHelper,
    private projectService: ProjectService,
    private changeDetector: ChangeDetectorRef,
    private calendarEventService: CalendarEventService,
    private notification: NotificationService,
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      if (currentUser) {
        this.user = currentUser;
      }
    });
    this.fetchEvents();
    this.getAllProjectsForUser();
    if (this.authHelper.checkIsNotUser()) {
      this.loadUsers();
    }
  }

  fetchEvents(): void {
    const userId = this.user
      ? this.user.id
      : this.userService.getCurrentUserId();

    this.calendarEventService.getEvents(userId).subscribe({
      next: (events: CalendarEvent[]) => this.handleCalendarEvent(events),
    });
  }

  private handleCalendarEvent(events: CalendarEvent[]): void {
    const fullCalendarEvents = events.map((event) => ({
      ...event,
      backgroundColor: CalendarHelper.setColor(
        event.project.id,
        this.projectsId
      ),
      title: `${
        event.title.split(this.projectNameInfo)[0]
      }${this.getProjectName(event)}`,
      extendedProps: { projectId: event.project.id },
    }));

    this.calendarOptions.mutate((options) => {
      options.events = fullCalendarEvents;
    });
  }

  loadUsers(): void {
    this.userService.getAllUser().subscribe({
      next: (users: User[]) => this.handleUsers(users),
    });
  }

  private handleUsers(users: User[]): void {
    this.users = users;
    this.userIdNameDTOs = UserHelper.transformUsersToAssignments(users);
  }

  onTabChanged(event: MatTabChangeEvent): void {
    const selectedUserId = this.userIdNameDTOs[event.index]?.id;
    this.user = this.users.find((u) => u.id === selectedUserId) || null;
    this.fetchEvents();
    this.getAllProjectsForUser();
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

    dialogRef.afterClosed().subscribe((createdEvent) => {
      const calendarApi = selectInfo.view.calendar;

      if (createdEvent && this.user) {
        const newEvent = new CalendarEvent(
          "",
          createdEvent.title,
          selectInfo.start,
          selectInfo.end,
          createdEvent.project,
          this.user
        );

        this.calendarEventService.createEvent(newEvent).subscribe((event) => {
          event.title = `${
            event.title.split(this.projectNameInfo)[0]
          }${this.getProjectName(event)}`;
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
        this.processEventUpdate(result, clickInfo);
      }
    });
  }

  handleEventChange(changeInfo: EventChangeArg) {
    const updatedEvent = {
      id: changeInfo.event.id,
      title: changeInfo.event.title,
      start: changeInfo.event.start,
      end: changeInfo.event.end,
    };

    this.updateEventOnServer(updatedEvent);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  private getProjectName(calendar: CalendarEvent): string {
    return this.projectNameInfo + calendar.project.title;
  }

  private getAllProjectsForUser(): void {
    const userId = this.user
      ? this.user.id
      : this.userService.getCurrentUserId();

    this.projectService
      .fetchProjects(userId, null, null, 0)
      .subscribe((data) => {
        this.projects = [...data.content];
        this.projectsId = this.projects?.map((project) => project.id);
      });
  }

  private processEventUpdate(result: any, clickInfo: EventClickArg) {
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
          this.proccessUpdateEvent(clickInfo, updatedEvent);
        }
      });
    }
  }

  private proccessUpdateEvent(
    clickInfo: EventClickArg | EventChangeArg,
    updatedEvent: CalendarEvent
  ) {
    this.notification.showSuccess("Event updated");
    let calendarApi = clickInfo.event;

    calendarApi.setProp(
      "title",
      `${
        updatedEvent.title.split(this.projectNameInfo)[0]
      }${this.getProjectName(updatedEvent)}`
    );
    calendarApi.setExtendedProp("project", updatedEvent.project);
    calendarApi.setProp(
      "backgroundColor",
      CalendarHelper.setColor(updatedEvent.project.id, this.projectsId)
    );
  }

  private updateEventOnServer(eventData: any) {
    this.calendarEventService.updateEvent(eventData).subscribe(() => {
      this.notification.showSuccess("Event updated");
    });
  }

  private updateEvent(calendarEvent: CalendarEvent): Observable<CalendarEvent> {
    return this.calendarEventService.updateEvent(calendarEvent);
  }

  private deleteEvent(id: string): Observable<string> {
    return this.calendarEventService.deleteEvent(id);
  }

  private getProjectFromEvent(event: EventImpl): Project | undefined {
    const projectId = event.extendedProps["projectId"];
    return this.projects.find((p) => p.id === projectId);
  }
}
