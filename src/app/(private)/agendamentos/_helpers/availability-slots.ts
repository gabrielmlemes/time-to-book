import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Ativamos o plugin de UTC para que o dayjs consiga lidar com fusos horários corretamente.
dayjs.extend(utc);

export interface TimeSlot {
  time: string;
  available: boolean;
  /** Indica se o horário já possui um agendamento confirmado no banco. */
  isOccupied: boolean;
  /** Indica se o horário está dentro da janela de atendimento definida pelo médico (ex: entre 08:00 e 18:00). */
  isWithinHours: boolean;
  /** Indica se o médico atende no dia da semana selecionado (ex: segunda a sexta). */
  isWithinWorkdays: boolean;
  /** Indica se o horário do slot já passou em relação ao momento atual (útil apenas para agendamentos no dia de hoje). */
  isPast: boolean;
}

/**
 * Converte uma string de hora UTC (HH:mm:ss) para um objeto dayjs Local.
 * Exemplo: Se no banco está "11:00:00" (UTC) e o usuário está em Brasília (UTC-3),
 * o retorno será um objeto representando "08:00:00" local.
 */
const parseUTCToLocal = (utcTime: string) => {
  return dayjs
    .utc() // Cria um objeto dayjs no modo UTC
    .set('hour', parseInt(utcTime.split(':')[0])) // Define a hora vinda do banco
    .set('minute', parseInt(utcTime.split(':')[1])) // Define o minuto vindo do banco
    .utc(true) // Força o dayjs a entender que esses valores JÁ ESTÃO em UTC (não deve converter agora)
    .local(); // Converte o valor final para o fuso horário local do navegador do usuário
};

/**
 * Verifica se o médico atende no dia da semana selecionado.
 * O método .day() do dayjs retorna: 0 (Domingo) a 6 (Sábado).
 */
const checkIsWorkingDay = (date: Date, fromDay: number, toDay: number) => {
  const dayOfWeek = dayjs(date).day();
  return dayOfWeek >= fromDay && dayOfWeek <= toDay;
};

/**
 * Gera a grade de horários base (strings HH:mm) entre o início e o fim do dia.
 */
const generateBaseGrid = (startHour = 5, endHour = 23, endMinute = 30) => {
  const grid: string[] = [];

  // Criamos um ponto de partida local para o loop
  let current = dayjs().set('hour', startHour).set('minute', 0).set('second', 0);

  // Criamos o ponto de parada final
  const last = dayjs().set('hour', endHour).set('minute', endMinute).set('second', 0);

  // Enquanto o horário atual for antes ou igual ao último horário permitido...
  while (current.isBefore(last) || current.isSame(last)) {
    grid.push(current.format('HH:mm')); // Adicionamos a string formatada ao array
    current = current.add(30, 'minute'); // Avançamos o relógio em 30 minutos
  }
  return grid;
};

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
    availableFromTime: string;
    availableToTime: string;
    availableFromWeekday: number;
    availableToWeekday: number;
  };
}

/**
 * Orquestra a geração de slots de disponibilidade, considerando grade, fuso horário,
 * conflitos de agenda e horários passados.
 */
export function getAvailabilitySlots({
  date,
  doctorId,
  currentAppointmentId,
  existingAppointments,
  doctor,
}: GetAvailabilitySlotsProps): TimeSlot[] {
  // Pegamos o momento exato de agora para validar horários passados
  const now = dayjs();

  // Verificamos se o dia que o usuário selecionou no calendário é o dia de hoje
  const isToday = dayjs(date).isSame(now, 'day');

  // 1. Pré-processamento: Convertemos a escala do médico (UTC) para o horário local
  const fromLocal = parseUTCToLocal(doctor.availableFromTime);
  const toLocal = parseUTCToLocal(doctor.availableToTime);
  const isWithinWorkdays = checkIsWorkingDay(
    date,
    doctor.availableFromWeekday,
    doctor.availableToWeekday
  );

  // 2. Mapeamento de conflitos: Criamos um Set com todos os horários já ocupados
  const occupiedTimes = new Set(
    existingAppointments
      .filter(
        (appt) =>
          appt.doctorId === doctorId &&
          dayjs(appt.date).isSame(dayjs(date), 'day') && // Filtra apenas agendamentos do mesmo dia
          appt.id !== currentAppointmentId // Ignora o próprio agendamento caso seja uma edição
      )
      .map((appt) => dayjs(appt.date).format('HH:mm')) // Extrai apenas a string "HH:mm" para o Set
  );

  // 3. Geração da grade: Criamos a lista base de horários do dia (05:00, 05:30...)
  const baseGrid = generateBaseGrid();

  // Transformamos cada string de horário em um objeto de Status completo
  return baseGrid.map((timeString) => {
    // Comparação simples de strings para saber se está no range de atendimento (ex: "09:00" >= "08:00")
    const isWithinHours =
      timeString >= fromLocal.format('HH:mm') && timeString <= toLocal.format('HH:mm');

    // Busca ultra rápida no Set para saber se o horário já está agendado
    const isOccupied = occupiedTimes.has(timeString);

    // Para validar se o horário "passou", precisamos criar um objeto de data completo
    const [hour, minute] = timeString.split(':').map(Number);
    const slotDateTime = dayjs(date).set('hour', hour).set('minute', minute).set('second', 0);

    // Se for hoje, comparamos se o horário do slot é anterior ao "now" (agora)
    const isPast = isToday && slotDateTime.isBefore(now);

    return {
      time: timeString,
      isOccupied,
      isWithinHours,
      isWithinWorkdays,
      isPast,
      // O horário só estará disponível se passar em TODOS os testes abaixo:
      available: isWithinWorkdays && isWithinHours && !isOccupied && !isPast,
    };
  });
}
