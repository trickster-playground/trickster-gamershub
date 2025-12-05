'use client';

import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import * as React from 'react';

const events = [
  { date: '2025-12-08', title: 'Mobile Legends', color: '#ff4d4f' },
  { date: '2025-12-08', title: 'PUBG', color: '#3b82f6' },
  { date: '2025-12-10', title: 'Valorant', color: '#22c55e' },
  { date: '2025-12-15', title: 'Dota 2', color: '#eab308' },
];

const EventCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date | undefined>(new Date());

  // Filter for events of the month the user is currently viewing
  const filteredEvents = events.filter((event) => {
    const e = new Date(event.date);
    return (
      e.getMonth() === month?.getMonth() &&
      e.getFullYear() === month?.getFullYear()
    );
  });

  // All events for one date
  const getEventsForDay = (day: Date) => {
    const d = day.toISOString().split('T')[0];
    return filteredEvents.filter((event) => event.date === d);
  };

  // Event for the selected date
  const selectedEvents = date ? getEventsForDay(date) : [];

  return (
    <Card className="w-full bg-transparent py-4">
      {/* Calendar */}
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={month}
          onMonthChange={(m: Date) => setMonth(m)}
          className="w-full rounded-lg"
          buttonVariant="ghost"
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const dayEvents = getEventsForDay(day.date);

              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                  <div className="flex flex-col items-center">
                    {children}

                    {/* Dot Indicator */}
                    {!modifiers.outside && dayEvents.length > 0 && (
                      <div className="mt-0.5 flex gap-[2px]">
                        {dayEvents.map((event, idx) => (
                          <span
                            key={idx}
                            className="inline-block"
                            style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor: event.color,
                            }}
                          ></span>
                        ))}
                      </div>
                    )}
                  </div>
                </CalendarDayButton>
              );
            },
          }}
        />
      </CardContent>

      {/* Events Information */}
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 pt-4">
        {/* Header selected date */}
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Event List */}
        <div className="flex w-full flex-col gap-2">
          {selectedEvents.length === 0 && (
            <div className="text-md px-1 text-muted-foreground">
              No events on this day.
            </div>
          )}

          {selectedEvents.map((event, index) => (
            <div
              key={index}
              className="relative rounded-md bg-dark-3 p-2 pl-6 text-sm"
            >
              {/* Event Color */}
              <span
                className="absolute inset-y-2 left-2 w-1 rounded-full"
                style={{ backgroundColor: event.color }}
              />

              <div className="font-medium">{event.title}</div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCalendar;
