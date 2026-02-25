// ================================
// TYPES
// ================================

export type SelectOption<T extends string> = Readonly<{
  value: T;
  label: string;
}>;

// ================================
// MEDICAL SPECIALTIES
// ================================

export const MedicalSpecialty = {
  ALERGOLOGIA: 'Alergologia',
  ANESTESIOLOGIA: 'Anestesiologia',
  ANGIOLOGIA: 'Angiologia',
  CANCEROLOGIA: 'Cancerologia',
  CARDIOLOGIA: 'Cardiologia',
  CIRURGIA_CARDIOVASCULAR: 'Cirurgia Cardiovascular',
  CIRURGIA_CABECA_PESCOCO: 'Cirurgia de Cabeça e Pescoço',
  CIRURGIA_DIGESTIVA: 'Cirurgia do Aparelho Digestivo',
  CIRURGIA_GERAL: 'Cirurgia Geral',
  CIRURGIA_PEDIATRICA: 'Cirurgia Pediátrica',
  CIRURGIA_PLASTICA: 'Cirurgia Plástica',
  CIRURGIA_TORACICA: 'Cirurgia Torácica',
  CIRURGIA_VASCULAR: 'Cirurgia Vascular',
  CLINICA_MEDICA: 'Clínica Médica',
  DERMATOLOGIA: 'Dermatologia',
  ENDOCRINOLOGIA: 'Endocrinologia e Metabologia',
  ENDOSCOPIA: 'Endoscopia',
  GASTROENTEROLOGIA: 'Gastroenterologia',
  GERIATRIA: 'Geriatria',
  GINECOLOGIA_OBSTETRICIA: 'Ginecologia e Obstetrícia',
  HEMATOLOGIA: 'Hematologia e Hemoterapia',
  HEPATOLOGIA: 'Hepatologia',
  HOMEOPATIA: 'Homeopatia',
  INFECTOLOGIA: 'Infectologia',
  MASTOLOGIA: 'Mastologia',
  MEDICINA_DE_EMERGENCIA: 'Medicina de Emergência',
  MEDICINA_DO_ESPORTO: 'Medicina do Esporte',
  MEDICINA_DO_TRABALHO: 'Medicina do Trabalho',
  MEDICINA_DE_FAMILIA: 'Medicina de Família e Comunidade',
  MEDICINA_FISICA_REABILITACAO: 'Medicina Física e Reabilitação',
  MEDICINA_INTENSIVA: 'Medicina Intensiva',
  MEDICINA_LEGAL: 'Medicina Legal e Perícia Médica',
  NEFROLOGIA: 'Nefrologia',
  NEUROCIRURGIA: 'Neurocirurgia',
  NEUROLOGIA: 'Neurologia',
  NUTROLOGIA: 'Nutrologia',
  OFTALMOLOGIA: 'Oftalmologia',
  ONCOLOGIA_CLINICA: 'Oncologia Clínica',
  ORTOPEDIA_TRAUMATOLOGIA: 'Ortopedia e Traumatologia',
  OTORRINOLARINGOLOGIA: 'Otorrinolaringologia',
  PATOLOGIA: 'Patologia',
  PATOLOGIA_CLINICA: 'Patologia Clínica/Medicina Laboratorial',
  PEDIATRIA: 'Pediatria',
  PNEUMOLOGIA: 'Pneumologia',
  PSIQUIATRIA: 'Psiquiatria',
  RADIOLOGIA: 'Radiologia e Diagnóstico por Imagem',
  RADIOTERAPIA: 'Radioterapia',
  REUMATOLOGIA: 'Reumatologia',
  UROLOGIA: 'Urologia',
} as const;

export type MedicalSpecialty = (typeof MedicalSpecialty)[keyof typeof MedicalSpecialty];

export const medicalSpecialties: ReadonlyArray<SelectOption<MedicalSpecialty>> = Object.values(
  MedicalSpecialty
).map((value) => ({
  value,
  label: value,
}));

// ================================
// DENTAL SPECIALTIES
// ================================

export const DentalSpecialty = {
  ACUPUNTURA_ODONTOLOGICA: 'Acupuntura Odontológica',
  CIRURGIA_BUCOMAXILOFACIAL: 'Cirurgia e Traumatologia Bucomaxilofacial',
  CLINICA_GERAL_ODONTOLOGICA: 'Clínica Geral Odontológica',
  DENTISTICA: 'Dentística',
  DISFUNCAO_TEMPOROMANDIBULAR: 'Disfunção Temporomandibular e Dor Orofacial',
  ENDODONTIA: 'Endodontia',
  ESTOMATOLOGIA: 'Estomatologia',
  HARMONIZACAO_OROFACIAL: 'Harmonização Orofacial',
  IMPLANTODONTIA: 'Implantodontia',
  ODONTOGERIATRIA: 'Odontogeriatria',
  ODONTOLOGIA_DO_TRABALHO: 'Odontologia do Trabalho',
  ODONTOLOGIA_LEGAL: 'Odontologia Legal',
  ODONTOLOGIA_PARA_PACIENTES_ESPECIAIS: 'Odontologia para Pacientes com Necessidades Especiais',
  ODONTOPEDIATRIA: 'Odontopediatria',
  ORTODONTIA: 'Ortodontia',
  ORTOPEDIA_FUNCIONAL_DOS_MAXILARES: 'Ortopedia Funcional dos Maxilares',
  PATOLOGIA_BUCAL: 'Patologia Bucal',
  PERIODONTIA: 'Periodontia',
  PROTESE_DENTARIA: 'Prótese Dentária',
  RADIOLOGIA_ODONTOLOGICA: 'Radiologia Odontológica e Imaginologia',
  SAUDE_COLETIVA_ODONTOLOGICA: 'Saúde Coletiva Odontológica',
} as const;

export type DentalSpecialty = (typeof DentalSpecialty)[keyof typeof DentalSpecialty];

export const dentalSpecialties: ReadonlyArray<SelectOption<DentalSpecialty>> = Object.values(
  DentalSpecialty
).map((value) => ({
  value,
  label: value,
}));
