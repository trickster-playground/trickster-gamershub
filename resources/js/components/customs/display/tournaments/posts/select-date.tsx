'use client';

import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SelectDateProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SelectDate({
  label,
  value,
  onChange,
}: SelectDateProps) {
  const [open, setOpen] = React.useState(false);

  // parse value dari parent
  const dateValue = value ? new Date(value) : undefined;
  const timeValue = value ? (value.split(' ')[1] ?? '00:00:00') : '00:00:00';

  const updateDateTime = (date?: Date, time?: string) => {
    if (!date) return;

    const finalTime = time ?? timeValue;
    const formattedDate = format(date, 'yyyy-MM-dd');
    onChange(`${formattedDate} ${finalTime}`);
  };

  return (
    <div className="mt-2 grid w-full gap-2 p-2">
      <Label>{label}</Label>

      <div className="flex w-full items-center gap-2">
        {/* DATE */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
            >
              {dateValue ? format(dateValue, 'MMMM dd, yyyy') : 'Select date'}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(date) => {
                updateDateTime(date);
                setOpen(false);
              }}
              useCustomNav={false}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>

        {/* TIME */}
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30:00"
          value={timeValue}
          className="w-full max-w-[100px] appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          onChange={(e) => updateDateTime(dateValue, e.target.value)}
        />
      </div>
    </div>
  );
}
