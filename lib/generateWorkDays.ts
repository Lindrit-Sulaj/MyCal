import { AvailableDays } from "@prisma/client";

export function generateWorkDays(availableDays: AvailableDays[]) {
  let groupedDays: { days: string[], value: string | null }[] = [];

  availableDays.forEach(d => {
    if (groupedDays.length === 0) {
      groupedDays.push({ days: [d.day], value: d.value })
    } else if (groupedDays[groupedDays.length - 1].value === d.value) {
      groupedDays[groupedDays.length - 1].days.push(d.day);
    } else {
      groupedDays.push({ days: [d.day], value: d.value })
    }
  });

  const formattedDates = groupedDays.map(group => {
    let day: string = ''

    if (group.days.length === 1) {
      day = (group.days[0].toLowerCase().charAt(0).toUpperCase() + group.days[0].toLowerCase().slice(1)).slice(0, 3);
    } else {
      let lowercaseFirstDay = group.days[0].toLowerCase();
      let lowercaseLastDay = group.days[group.days.length - 1].toLowerCase();

      let firstDay = (lowercaseFirstDay.charAt(0).toUpperCase() + lowercaseFirstDay.slice(1)).slice(0, 3)
      let secondDay = (lowercaseLastDay.charAt(0).toUpperCase() + lowercaseLastDay.slice(1)).slice(0, 3)

      day = `${firstDay} - ${secondDay}`
    }

    if (group.value) {
      return `${day}, ${group.value}`
    } else {
      return null
    }
  }).filter(f => f !== null)

  return formattedDates
}