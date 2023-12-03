import { Component } from "@angular/core";
import { PaginatorHelper } from "../../services/paginator.service.ts";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserRole } from "../../enums/user-role.enum";
import { Bill } from "../../models/bill.modal.js";
import { IdNameDTO } from "../../models/IdNameDTO.modal";
import { UserService } from "../../services/user.service";
import { BillService } from "../../services/bill.service";
import { AuthHelper } from "../../helper/auth.helper";
import { NotificationService } from "../../services/notification.service";
import { UserHelper } from "../../helper/user.helper";

@Component({
  selector: "app-bill",
  templateUrl: "./bill.component.html",
  styleUrls: ["./bill.component.css"],
})
export class BillComponent extends PaginatorHelper {
  billForm!: FormGroup;
  minStartDate!: Date;
  maxStartDate!: Date;
  userId: string | null = null;
  bills: Bill[] = [];
  billTypes: string[] = [];
  role: typeof UserRole = UserRole;
  userIdNameDTOs: IdNameDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private billService: BillService,
    private userService: UserService,
    private authHelper: AuthHelper,
    private notification: NotificationService
  ) {
    super();
    if (this.authHelper.checkIsNotUser()) {
      this.loadUsers();
    }
    this.initialize();
  }

  override fetchData() {
    this.fetchBills();
  }

  loadUsers(): void {
    this.userService.getUserIdNameDTOs().subscribe((users) => {
      this.userIdNameDTOs = users;
    });
  }

  initialize() {
    this.billForm = this.fb.group({
      start: [Date, Validators.required],
      end: [Date, Validators.required],
      billType: [""],
      user: [IdNameDTO],
    });
  }

  fetchBills(): void {
    if (this.billForm.valid) {
      const startDate = new Date(this.billForm.value.start)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(this.billForm.value.end)
        .toISOString()
        .split("T")[0];

      this.userId = this.billForm.value.user.id;
      this.billService
        .getBills(this.userId, startDate, endDate)
        .subscribe((data) => {
          this.bills = data.map((bill) => ({
            ...bill,
            userName: UserHelper.findUserNameById(
              this.userIdNameDTOs,
              bill.userId
            ),
          }));
        });
    }
  }

  public downloadBill(bill: Bill): void {
    this.billService.downloadBillFile(bill.id).subscribe((blob) => {
      const newBlob = new Blob([blob], { type: "m" });
      const nav = window.navigator as any;
      if (nav && nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(newBlob);
        return;
      }
      const url = window.URL.createObjectURL(newBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = this.getBillShortFileName(bill);
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);
    });
  }

  getBillShortFileName(bill: Bill): string {
    const date = new Date(bill.endDate);
    const formattedMonth = ("0" + (date.getMonth() + 1)).slice(-2);
    const userNameWithSeparate = bill.filename.replace(/ /g, "_");

    return `bill_${userNameWithSeparate}_${formattedMonth}.pdf`;
  }

  public regenerateBill(bill: Bill): void {
    this.billService.regenerateBill(bill.id).subscribe((note) => {
      if (note) {
        console.log(note);
        this.notification.showSuccess(note);
      }
    });
  }
}
