const formatDate = (date: Date) => {
    const yyyy = date.getUTCFullYear(),
      mm = String(date.getUTCMonth() + 1).padStart(2, "0"),
      dd = String(date.getUTCDate() + 1).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },
  getWeek = (date: Date | string) => {
    const start = new Date(date);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 6);
    return `${formatDate(start)}_${formatDate(end)}`;
  };

export { formatDate, getWeek };
