const formatDate = (date: Date) => {
    const yyyy = date.getUTCFullYear(),
      mm = String(date.getUTCMonth() + 1).padStart(2, "0"),
      dd = String(date.getDate() + 1).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },
  getWeek = (date: Date | string) => {
    const start = new Date(date),
      end = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    end.setDate(end.getDate() + 6 - start.getDay());
    return `${formatDate(start)}_${formatDate(end)}`;
  };

export { formatDate, getWeek };
