import { faker } from '@faker-js/faker/locale/pt_BR';
import { eq } from 'drizzle-orm';

import { db } from '.';
import * as schema from './schema';

/**
 * Busca a primeira clínica associada a um usuário no banco de dados.
 * Um script de seed não possui um "usuário logado", então usamos o primeiro
 * que encontrarmos como base para popular os dados.
 */
async function getFirstUserClinicId() {
  console.log('🕵️ Buscando uma clínica de usuário existente...');

  const [userToClinic] = await db
    .select({
      clinicId: schema.usersToClinicsTable.clinicId,
    })
    .from(schema.usersToClinicsTable)
    .limit(1);

  if (!userToClinic?.clinicId) {
    console.error('❌ Nenhuma clínica associada a um usuário foi encontrada.');
    console.error(
      '👉 Por favor, faça login na aplicação ao menos uma vez para que um usuário e uma clínica sejam criados antes de rodar o seed.'
    );
    throw new Error('Pré-requisito para o seed não atendido.');
  }

  console.log(`🏢 Clínica encontrada com ID: ${userToClinic.clinicId}`);
  return userToClinic.clinicId;
}

/**
 * Gera dados de um médico fake.
 * @param clinicId - O ID da clínica para associar o médico.
 */
function createRandomDoctor(clinicId: string): typeof schema.doctorsTable.$inferInsert {
  const specialties = [
    'Cardiologia',
    'Dermatologia',
    'Ortopedia',
    'Pediatria',
    'Neurologia',
    'Ginecologia',
  ];
  const availableFrom = faker.number.int({ min: 7, max: 9 }); // Das 07:00 às 09:00

  return {
    clinicId,
    name: `Dr(a). ${faker.person.firstName()} ${faker.person.lastName()}`,
    avatarImageUrl: faker.image.avatar(),
    specialty: faker.helpers.arrayElement(specialties),
    availableFromWeekday: 1, // Segunda-feira
    availableToWeekday: 5, // Sexta-feira
    availableFromTime: `${String(availableFrom).padStart(2, '0')}:00:00`,
    availableToTime: `${String(availableFrom + 9).padStart(2, '0')}:00:00`, // 9 horas de expediente
    appointmentPriceInCents: faker.number.int({ min: 15000, max: 50000 }),
  };
}

async function main() {
  console.log('🌱 Iniciando o processo de seed...');

  try {
    const clinicId = await getFirstUserClinicId();

    console.log('👨‍⚕️ Gerando 10 médicos fakes...');
    const fakeDoctors = Array.from({ length: 10 }, () => createRandomDoctor(clinicId));

    console.log('🗑️ Limpando registros de médicos antigos da clínica para evitar duplicatas...');
    await db.delete(schema.doctorsTable).where(eq(schema.doctorsTable.clinicId, clinicId));

    console.log('🗂️ Inserindo novos médicos no banco de dados...');
    await db.insert(schema.doctorsTable).values(fakeDoctors);

    console.log('✅ Processo de seed concluído com sucesso!');
    console.log(`${fakeDoctors.length} médicos foram inseridos na clínica de ID: ${clinicId}.`);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error('❌ Erro durante o processo de seed:', (error as any).message);
    process.exit(1);
  }
}

main();
