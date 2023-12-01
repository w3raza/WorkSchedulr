import { Component } from "@angular/core";
import { PaginatorHelper } from "../../services/paginator.service.ts";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserRole } from "../../enums/user-role.enum";
import { Bill } from "../../models/bill.modal.js";
import { IdNameDTO } from "../../models/IdNameDTO.modal.js";
import { DatePipe } from "@angular/common";
import { UserService } from "../../services/user.service";
import { BillService } from "../../services/bill.service";
import { AuthHelper } from "../../helper/auth.helper";

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
    private datePipe: DatePipe
  ) {
    super();
    if (this.authHelper.checkIsNotUser()) {
      this.loadUsers();
    }
  }

  override fetchData() {}
  initForm(): void {
    this.billForm = this.fb.group({
      start: ["", Validators.required],
      end: ["", Validators.required],
    });
  }

  loadUsers(): void {
    this.userIdNameDTOs = this.userService.getUserIdNameDTOs();
  }

  onSubmitSelect(): void {
    if (this.billForm.valid) {
      this.fetchBills();
    }
  }

  fetchBills(): void {
    const startDate = this.billForm.value.start;
    const endDate = this.billForm.value.end;
    this.billService
      .getBills(this.userId, startDate, endDate)
      .subscribe((data) => {
        this.bills = [...data];
      });
  }

  public getBillFile(bill: Bill): void {
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
    const date = this.datePipe.transform(new Date(bill.endDate), "MM");
    const userNameWithSeparate = bill.filename.replace(/ /g, "_");

    return `bill_${userNameWithSeparate}_${date}.pdf`;
  }
  // Inne metody, jeśli są potrzebne
}
