import { format, formatDistanceToNow, getTime, intervalToDuration } from "date-fns";

import { ServerTimestamp } from "@/types/date";

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
    const fm = newFormat || "dd MMM yyyy";

    return date ? format(new Date(date), fm) : "";
}

export function fTime(date: InputValue, newFormat?: string) {
    const fm = newFormat || "p";

    return date ? format(new Date(date), fm) : "";
}

export function fDateTime(date: InputValue, newFormat?: string) {
    const fm = newFormat || "dd MMM yyyy p";

    return date ? format(new Date(date), fm) : "";
}

export function fTimestamp(date: InputValue) {
    return date ? getTime(new Date(date)) : "";
}

export function fToNow(date: InputValue) {
    return date
        ? formatDistanceToNow(new Date(date), {
              addSuffix: true,
          })
        : "";
}

export function isBetween(inputDate: Date | string | number, startDate: Date, endDate: Date) {
    const date = new Date(inputDate);

    const results =
        new Date(date.toDateString()) >= new Date(startDate.toDateString()) &&
        new Date(date.toDateString()) <= new Date(endDate.toDateString());

    return results;
}

export function isAfter(startDate: Date | null, endDate: Date | null) {
    const results =
        startDate && endDate ? new Date(startDate).getTime() > new Date(endDate).getTime() : false;

    return results;
}

export function formatServerTimestamp(timestamp: ServerTimestamp) {
    const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);

    return fDate(date);
}

export function formatSeconds(seconds: number) {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

    let shortDuration = "";

    if (duration.hours) {
        shortDuration += `${duration.hours}h `;
    }

    if (duration.minutes || duration.hours) {
        shortDuration += `${duration.minutes}min `;
    }

    if (duration.seconds || duration.minutes || duration.hours) {
        shortDuration += `${duration.seconds}s`;
    }

    return shortDuration.trim();
}
