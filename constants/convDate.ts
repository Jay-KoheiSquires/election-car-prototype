import moment from "moment/moment";

export const convDate = (date: any) => {
  date !== null
    ? moment(date).format("YYYY/MM/DD")
    : "";

  return date;
};

export const en = (data: number) => {
  return data && `¥${data.toLocaleString()}`;
};
