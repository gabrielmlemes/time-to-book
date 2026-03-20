'use client';

import { addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { parseAsIsoDate, useQueryState } from 'nuqs';
import * as React from 'react';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function DatePickerWithRange() {
  const [from, setFrom] = useQueryState('from', parseAsIsoDate.withDefault(new Date())); // O parseAsIsoDate é passado como segundo parâmetro para já converter o valor da URL para uma data. Pois por padrão o valor que é salvo na URL é em formato de string, então pra isso que ele serve, pra fazer esta conversão. E já passamos a data atual como default também.
  const [to, setTo] = useQueryState('to', parseAsIsoDate.withDefault(addMonths(new Date(), 30))); // Faz o mesmo, porém acrescenta 1 mês.

  const date = {
    from: from,
    to: to,
  };

  const handleDateSelect = (date: DateRange | undefined) => {
    if (date?.from && date?.to) {
      setFrom(date.from);
      setTo(date.to);
    }
  };

  return (
    <Field className="mx-auto w-60 flex flex-col justify-center items-center">
      <FieldLabel
        htmlFor="date-picker-range"
        className="text-center w-full flex justify-center items-center"
      >
        Selecione um período
      </FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 mr-4" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
