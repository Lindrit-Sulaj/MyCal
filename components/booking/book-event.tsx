'use client'

import React, { useEffect, useState } from 'react'
import { AfterBooking, DateRange, Schedule, OutOfOfficeReason } from '@prisma/client'
import { Calendar } from '../ui/calendar'
import { getBookingsFromEventType } from '@/app/actions/booking'

export default function BookEvent({ dateRange, afterBooking, duration, outOfOffice, schedule, eventTypeId }: {
  dateRange: DateRange, afterBooking: AfterBooking, duration: number, schedule: Schedule, outOfOffice: {
    dates: {
      from: Date;
      to: Date;
    };
    reason: OutOfOfficeReason;
    notes: string | null;
  }[],
  eventTypeId: string
}) {
  const [status, setStatus] = useState<'Date' | 'Questions'>('Date')
  const [date, setDate] = React.useState<Date | undefined>();
  const [currentSlots, setCurrentSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  function getDisabledWeekDays() {
    const disabledWeekDays: number[] = [];
    schedule.availableDays.forEach((ad, i) => {
      if (!ad.value) {
        disabledWeekDays.push(i === 6 ? 0 : i + 1)
      }
    });
    return disabledWeekDays
  }

  function getDateRange() {
    const today = new Date();
    const daysInFuture = new Date();
    daysInFuture.setDate(today.getDate() + Number(dateRange.value))

    return {
      fromDate: today,
      toDate: daysInFuture
    }
  }

  useEffect(() => {
    if (!date) return;
    const validSlots: string[] = [];

    const weekDay = date.getDay();

    function getAllSlots(startTime: string, endTime: string, increment: number) {
      const result = [];

      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date();
      endDate.setHours(endHour, endMinute, 0, 0);

      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        result.push(`${hours}:${minutes}`);

        currentDate.setMinutes(currentDate.getMinutes() + increment);
      }

      result.pop()

      return result;
    }

    async function getBookings() {
      setLoadingSlots(true);
      return await getBookingsFromEventType(eventTypeId, date!)
    }

    const currentDayAvailability = schedule.availableDays[weekDay === 0 ? 6 : weekDay - 1].value;
    const startTime = currentDayAvailability?.split('-')[0].slice(0, 5)!
    const endTime = currentDayAvailability?.split('-')[1].slice(1, 6)!

    const allSlots = getAllSlots(startTime, endTime, duration);

    console.log(allSlots)

    getBookings()
      .then((result) => {
        console.log(result);
        allSlots.forEach(slot => {
          let isAvailable = true;
          const [hour, minute] = slot.split(':').map(Number);
          
          const originalDate = new Date(date);
          originalDate.setHours(hour, minute, 0, 0);
          
          result.forEach(r => {
            const resultDate = r.date;
            const resultDateWithDuration = new Date(resultDate.getTime() + r.duration * 60000);

            const originalDateWithDuration = new Date(originalDate.getTime() + duration * 60000);

            if (originalDate >= resultDate && originalDate < resultDateWithDuration) {
              isAvailable = false;
            };

            if (originalDateWithDuration >= resultDate && originalDate < resultDate) {
              isAvailable = false;
            }
          });

          if (isAvailable) {
            validSlots.push(slot)
          }
        })
        setCurrentSlots(validSlots)
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [date])

  return (
    <div className={`${status === "Date" && "flex"}`}>
      {status === "Date" && (
        <>
          <div className='p-4 lg:p-6 flex justify-center'>
            <Calendar
              mode="single"
              selected={date}
              disabled={[
                { dayOfWeek: getDisabledWeekDays() },
                ...(outOfOffice.map(o => o.dates))
              ]}
              modifiers={{
                outOfOffice: [
                  ...(outOfOffice.map(o => o.dates))
                ]
              }}

              onSelect={setDate}
              fromDate={new Date()}
              {...(dateRange.type === "CALENDAR_DAYS" && {
                fromDate: getDateRange().fromDate,
                toDate: getDateRange().toDate
              })}
            />
          </div>
          {date && (
            <div>
              <p>{date.toDateString()}</p>
              <pre>
                {JSON.stringify(currentSlots, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}

    </div>
  )
}
