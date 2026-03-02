import { Calendar1Icon, Clock1Icon, Cross, DollarSignIcon, UserIcon } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { doctorsTable } from '@/db/schema';
import { formatCurrencyInCents } from '@/helpers/format-currency';

import { formatWeekday, getAvailability } from '../../_helpers/availability';
import ProfessionalDetailsButton from './professional-details-button';

interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const availability = getAvailability(doctor);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback>
              <UserIcon className="size-8" />
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1 ">
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="px-1">
                <Cross />
              </Badge>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Separator />

        <div className="flex flex-col gap-4 my-5">
          <Badge variant="secondary" className="w-fit gap-2 py-1 [&>svg]:size-4">
            <Calendar1Icon className="text-muted-foreground" />
            <span className="text-sm">
              {formatWeekday(availability.from)} a {formatWeekday(availability.to)}
            </span>
          </Badge>

          <Badge variant="secondary" className="w-fit gap-2 py-1 [&>svg]:size-4">
            <Clock1Icon className="text-muted-foreground" />
            <span className="text-sm">
              {availability.from.format('HH:mm')} às {availability.to.format('HH:mm')}
            </span>
          </Badge>

          <Badge variant="secondary" className="w-fit gap-2 py-1 [&>svg]:size-4">
            <DollarSignIcon className="text-muted-foreground" />
            <span className="text-sm">{formatCurrencyInCents(doctor.appointmentPriceInCents)}</span>
          </Badge>
        </div>
        <Separator />

        <CardFooter className="mt-5 px-0">
          <ProfessionalDetailsButton />
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
