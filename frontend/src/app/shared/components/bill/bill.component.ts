import { Component } from "@angular/core";
import { PaginatorHelper } from "../../services/paginator.service.ts";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserRole } from "../../enums/userRole.enum";
import { Bill } from "../../models/bill.modal";
import { IdName } from "../../models/idName.modal";
import { UserService } from "../../services/user.service";
import { BillService } from "../../services/bill.service";
import { AuthHelper } from "../../helper/auth.helper";
import { NotificationService } from "../../services/notification.service";
import { UserHelper } from "../../helper/user.helper";
import { FormOfContract } from "../../enums/formOfContract.enum";

@Component({
  selector: "app-bill",
  templateUrl: "./bill.component.html",
  styleUrls: ["./bill.component.css"],
})
export class BillComponent extends PaginatorHelper {
  billForm!: FormGroup;
  formOfContracts: string[] = Object.values(FormOfContract);
  formOfContract: typeof FormOfContract = FormOfContract;
  minStartDate!: Date;
  maxStartDate!: Date;
  userId: string | null = null;
  bills: Bill[] = [];
  role: typeof UserRole = UserRole;
  userIdNames: IdName[] = [];

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
    this.userService.getUserIdNames().subscribe((users) => {
      this.userIdNames = users;
    });
  }

  initialize() {
    this.billForm = this.fb.group({
      start: [Date, Validators.required],
      end: [Date, Validators.required],
      FormOfContract: [FormOfContract],
      user: [IdName],
    });
    this.formOfContracts.push("Default");
    const defaultIdName = new IdName(
      (this.userIdNames.length + 1).toString(),
      "Default"
    );
    this.userIdNames.push(defaultIdName);
  }

  fetchBills(): void {
    if (this.billForm.valid) {
      const startDate = new Date(this.billForm.value.start)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(this.billForm.value.end)
        .toISOString()
        .split("T")[0];
      let formOfContract = null;
      if (this.billForm.value.FormOfContract !== "All types") {
        formOfContract = this.getFormOfContractValue();
      }

      this.userId = this.billForm.value.user.id;
      this.billService
        .getBills(
          this.userId,
          formOfContract,
          startDate,
          endDate,
          this.currentPage - 1,
          this.pageSize
        )
        .subscribe((data) => {
          this.bills = data.content.map((bill) => ({
            ...bill,
            userName: UserHelper.findUserNameById(
              this.userIdNames,
              bill.userId
            ),
          }));
          this.updatePaginationData(data.totalElements);
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
        this.notification.showSuccess(note);
      }
    });
  }

  getFormOfContractValue(): string {
    return Object.keys(this.formOfContract)[
      Object.values(this.formOfContract).indexOf(
        this.billForm.value.FormOfContract
      )
    ];
  }

  getContractDisplayValue(contractKey: string): string {
    return (
      FormOfContract[contractKey as keyof typeof FormOfContract] || contractKey
    );
  }
}
