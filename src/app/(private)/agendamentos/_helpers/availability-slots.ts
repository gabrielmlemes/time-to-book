import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface TimeSlot {
  time: string;
  available: boolean;
  isOccupied: boolean;
  isWithinHours: boolean;
  isWithinWorkdays: boolean;
  isPast: boolean;
}

interface GetAvailabilitySlotsProps {
  date: Date;
  doctorId: string;
  currentAppointmentId?: string;
  existingAppointments: {
    id: string;
    date: Date;
    doctorId: string;
  }[];
  doctor: {
    availableFromTime: string; // HH:mm:ss em UTC
    availableToTime: string; // HH:mm:ss em UTC
    availableFromWeekday: number;
    availableToWeekday: number;
  };
}

/**
 * Gera os slots de horários disponíveis baseados na grade do médico e agendamentos existentes.
 */
export function getAvailabilitySlots({
  date,
  doctorId,
  currentAppointmentId,
  existingAppointments,
  doctor,
}: GetAvailabilitySlotsProps): TimeSlot[] {
  const now = dayjs();
  const isToday = dayjs(date).isSame(now, 'day');
  const selectedDay = dayjs(date).day();

  // 1. Verificar se o dia da semana está no range de trabalho do médico
  const isWithinWorkdays =
    selectedDay >= doctor.availableFromWeekday && selectedDay <= doctor.availableToWeekday;

  // 2. Converter limites UTC do médico para Local
  const fromLocal = dayjs
    .utc()
    .set('hour', parseInt(doctor.availableFromTime.split(':')[0]))
    .set('minute', parseInt(doctor.availableFromTime.split(':')[1]))
    .utc(true)
    .local();

  const toLocal = dayjs
    .utc()
    .set('hour', parseInt(doctor.availableToTime.split(':')[0]))
    .set('minute', parseInt(doctor.availableToTime.split(':')[1]))
    .utc(true)
    .local();

  // 3. Filtrar agendamentos existentes
  const appointmentsOnSelectedDay = existingAppointments.filter((appt) => {
    const apptDate = dayjs(appt.date);
    return (
      appt.doctorId === doctorId &&
      apptDate.isSame(dayjs(date), 'day') &&
      appt.id !== currentAppointmentId
    );
  });

  // 4. Gerar a grade fixa (Slots de 30 em 30 min)
  const slots: TimeSlot[] = [];
  let currentSlot = dayjs().set('hour', 5).set('minute', 0).set('second', 0);
  const lastSlot = dayjs().set('hour', 23).set('minute', 30).set('second', 0);

  while (currentSlot.isBefore(lastSlot) || currentSlot.isSame(lastSlot)) {
    const timeString = currentSlot.format('HH:mm');

    const isWithinHours =
      timeString >= fromLocal.format('HH:mm') && timeString <= toLocal.format('HH:mm');
    const isOccupied = appointmentsOnSelectedDay.some(
      (appt) => dayjs(appt.date).format('HH:mm') === timeString
    );

    const slotTimeToday = dayjs(date)
      .set('hour', currentSlot.hour())
      .set('minute', currentSlot.minute())
      .set('second', 0);

    const isPast = isToday && slotTimeToday.isBefore(now);

    slots.push({
      time: timeString,
      isOccupied,
      isWithinHours,
      isWithinWorkdays,
      isPast,
      available: isWithinWorkdays && isWithinHours && !isOccupied && !isPast,
    });

    currentSlot = currentSlot.add(30, 'minute');
  }

  return slots;
}
