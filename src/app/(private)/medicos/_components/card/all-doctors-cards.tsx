import { doctorsTable } from '@/db/schema';

import DoctorCard from './doctor-card';

type AllDoctorsCardsProps = {
  doctors: (typeof doctorsTable.$inferSelect)[];
};

export default function AllDoctorsCards({ doctors }: AllDoctorsCardsProps) {
  return (
    <div
      className="grid 
      gap-6 
      grid-cols-1 
      sm:grid-cols-2 
      xl:grid-cols-3 
      "
    >
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
