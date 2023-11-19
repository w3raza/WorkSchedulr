export class CalendarHelper {
  static setColor(id: string, ids: string[]) {
    const colors = [
      "#3475C1",
      "#00b359",
      "#cc4400",
      "#00cccc",
      "#9900e6",
      "#e6e60",
      "#e60000",
      "#003366",
      "#206040",
      "#0066cc",
    ];
    return colors[ids.indexOf(id)] || "#3475C1";
  }
}
