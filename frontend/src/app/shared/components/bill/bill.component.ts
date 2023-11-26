import { Component } from "@angular/core";
import { PaginatorHelper } from "../../services/paginator.service.ts";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserRole } from "../../enums/user-role.enum";

@Component({
  selector: "app-bill",
  templateUrl: "./bill.component.html",
  styleUrls: ["./bill.component.css"],
})
export class BillComponent extends PaginatorHelper {
  billForm!: FormGroup;
  minStartDate!: Date; // Minimalna data początkowa
  maxStartDate!: Date; // Maksymalna data początkowa
  bills: any[] = []; // Lista rachunków
  billTypes: string[] = [];
  role: typeof UserRole = UserRole;
  usersSelect: Array<{ id?: string; fullName?: string }> = [];
  isLoading = false; // Status ładowania danych

  constructor(private fb: FormBuilder) {
    super();
  }

  override fetchData() {}
  initForm(): void {
    this.billForm = this.fb.group({
      start: ["", Validators.required],
      end: ["", Validators.required],
    });
  }

  onSubmitSelect(): void {
    if (this.billForm.valid) {
      this.fetchBills();
    }
  }

  fetchBills(): void {
    this.isLoading = true;
    const startDate = this.billForm.value.start;
    const endDate = this.billForm.value.end;

    // Tutaj umieść logikę do pobierania danych rachunków na podstawie zakresu dat
    // Na przykład: this.billService.getBills(startDate, endDate).subscribe(...)

    this.isLoading = false;
  }

  // Inne metody, jeśli są potrzebne
}
