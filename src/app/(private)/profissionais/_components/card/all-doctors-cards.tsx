import { Doctor } from '../../_types/doctor';
import DoctorCard from './doctor-card';

type AllDoctorsCardsProps = {
  doctors: Doctor[];
};

export default function AllDoctorsCards({ doctors }: AllDoctorsCardsProps) {
  return (
    <>
      {doctors.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Nenhum médico cadastrado</p>
      )}
    </>
  );
}
