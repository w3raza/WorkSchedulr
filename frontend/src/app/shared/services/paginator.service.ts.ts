import { PageEvent } from "@angular/material/paginator";

export class PaginatorHelper {
  currentPage: number = 1;
  pageSize: number = 10;

  totalElements: number = 0;

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchData();
  }

  updatePaginationData(totalElements: number) {
    this.totalElements = totalElements;
  }

  fetchData() {
    throw new Error("fetchData must be implemented in the derived class");
  }

  nextPage() {
    this.currentPage++;
    this.fetchData();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchData();
    }
  }
}
