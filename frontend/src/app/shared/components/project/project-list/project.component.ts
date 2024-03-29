import { Component } from "@angular/core";
import { Project } from "../../../models/project.modal";
import { ProjectService } from "../../../services/project.service";
import { MatDialog } from "@angular/material/dialog";
import { UserRole } from "../../../enums/userRole.enum";
import { ProjectCreateComponent } from "../project-create/project-create.component";
import { PaginatorHelper } from "../../../services/paginator.service.ts";
import { AuthHelper } from "../../../helper/auth.helper";
import { Observable, debounceTime, switchMap, tap } from "rxjs";
import { FormControl } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"],
})
export class ProjectComponent extends PaginatorHelper {
  projects: Project[] = [];
  role: typeof UserRole = UserRole;

  searchControl = new FormControl();
  filteredProjects: Observable<Project[]> | undefined;
  filterProjectStatus: { value: boolean; viewValue: string }[] = [];
  selectedStatus: any = null;

  userId: string | null = null;
  searchTerm: string | null = null;

  colors: string[] = [
    "rgba(92,41,0,0.2)",
    "rgba(0,37,92,0.2)",
    "rgba(2,92,0.3,0.2)",
    "rgba(63, 92, 0,0.2)",
    "rgba(0, 70, 92,0.2)",
    "rgba(92, 0, 83,0.2)",
    "rgba(92, 0, 0,0.2)",
  ];

  buttonsColor: string[] = [
    "rgba(92,41,0,0.5)",
    "rgba(0,37,92,0.5)",
    "rgba(2,92,0.3,0.5)",
    "rgba(63, 92, 0,0.5)",
    "rgba(0, 70, 92,0.5)",
    "rgba(92, 0, 83,0.5)",
    "rgba(92, 0, 0,0.5)",
  ];

  constructor(
    private authHelper: AuthHelper,
    private userService: UserService,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {
    super();
    this.filterProjectStatus = this.initActiveStatus();
    this.fetchProjects();
    if (!this.authHelper.checkIsAdmin()) {
      this.userId = this.userService.getCurrentUserId();
    }
    this.initProjectSubscription();
  }

  private initProjectSubscription() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap((searchTerm) => {
          this.searchTerm = searchTerm;
        }),
        switchMap((searchTerm) =>
          this.projectService.fetchProjects(
            this.userId,
            this.selectedStatus,
            searchTerm,
            this.currentPage - 1
          )
        )
      )
      .subscribe((data) => {
        this.projects = [...data.content];
        this.updatePaginationData(data.totalElements);
      });
  }

  initActiveStatus(): { value: any; viewValue: string }[] {
    return [
      { value: true, viewValue: "ENABLE" },
      { value: false, viewValue: "DISABLED" },
      { value: null, viewValue: "Default" },
    ];
  }

  fetchProjects() {
    this.projectService
      .fetchProjects(
        this.userId,
        this.selectedStatus,
        this.searchTerm,
        this.currentPage - 1
      )
      .subscribe((data) => {
        this.projects = [...data.content];
      });
  }

  getBackgroundColor(index: number) {
    return {
      "background-color": `${this.colors[index % (this.colors.length - 1)]}`,
    };
  }

  getButtonColor(index: number) {
    return {
      "background-color": `${
        this.buttonsColor[index % (this.buttonsColor.length - 1)]
      }`,
    };
  }

  openCreateProjectModal() {
    const dialogRef = this.dialog.open(ProjectCreateComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((newProject) => {
      if (newProject) {
        this.addProjectToList(newProject);
        this.notificationService.showSuccess("Project created");
      }
    });
  }

  addProjectToList(newProject: Project) {
    this.projects = [newProject, ...this.projects];
  }
}
