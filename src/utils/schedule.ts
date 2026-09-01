/**
 * Modelo da grade de horários da Pulso Concept.
 *
 * A grade real (dias x horários x tipo de treino) vive aqui como dados —
 * o formulário de contato usa essas funções para só oferecer combinações de
 * dia/horário que realmente existem, filtradas pelo interesse do usuário.
 */

export type WeekDay =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado";

export type ClassType =
  | "funcional"
  | "hiit"
  | "pilates"
  | "musculacao"
  | "funcional-teen";

export type Interest = "funcional" | "academia" | "os-dois";

export interface ScheduleSlot {
  day: WeekDay;
  time: string;
  type: ClassType;
}

export const CLASS_TYPE_INFO: Record<
  ClassType,
  { label: string; dotClassName: string }
> = {
  funcional: { label: "Funcional", dotClassName: "bg-orange-500" },
  hiit: { label: "HIIT 40'", dotClassName: "bg-red-500" },
  pilates: { label: "Pilates Funcional", dotClassName: "bg-purple-500" },
  musculacao: { label: "Musculação", dotClassName: "bg-blue-500" },
  "funcional-teen": { label: "Funcional Teen", dotClassName: "bg-green-500" },
};

// Espelha a divisão de espaços do Studio (Sala Funcional x Sala de
// Musculação — ver components/sections/Spaces.tsx): cada interesse declarado
// no formulário libera apenas os tipos de treino daquele espaço.
export const INTEREST_CLASS_TYPES: Record<Interest, ClassType[]> = {
  funcional: ["funcional", "hiit", "pilates", "funcional-teen"],
  academia: ["musculacao"],
  "os-dois": ["funcional", "hiit", "pilates", "funcional-teen", "musculacao"],
};

export const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "funcional", label: "Treino funcional" },
  { value: "academia", label: "Academia" },
  { value: "os-dois", label: "Os dois" },
];

// Rótulos curtos de propósito: viram chips compactos que fluem em uma linha
// (o fieldset "Quantas vezes por semana?" já dá o contexto completo).
export const FREQUENCY_OPTIONS = [
  { value: "1x", label: "1x" },
  { value: "2x", label: "2x" },
  { value: "3x", label: "3x" },
  { value: "4x", label: "4x" },
  { value: "5x+", label: "5x+" },
] as const;

// Grade semanal — mantida em sincronia com o material de horários do Studio.
export const SCHEDULE: ScheduleSlot[] = [
  // Segunda
  { day: "segunda", time: "06:00", type: "funcional" },
  { day: "segunda", time: "07:00", type: "funcional" },
  { day: "segunda", time: "10:00", type: "pilates" },
  { day: "segunda", time: "12:00", type: "hiit" },
  { day: "segunda", time: "17:00", type: "funcional-teen" },
  { day: "segunda", time: "18:00", type: "funcional" },
  { day: "segunda", time: "19:00", type: "funcional" },
  // Terça
  { day: "terca", time: "06:00", type: "funcional" },
  { day: "terca", time: "07:00", type: "funcional" },
  { day: "terca", time: "09:00", type: "funcional" },
  { day: "terca", time: "16:00", type: "musculacao" },
  { day: "terca", time: "18:00", type: "funcional" },
  { day: "terca", time: "19:00", type: "funcional" },
  // Quarta
  { day: "quarta", time: "06:00", type: "funcional" },
  { day: "quarta", time: "07:00", type: "funcional" },
  { day: "quarta", time: "12:00", type: "hiit" },
  { day: "quarta", time: "17:00", type: "funcional-teen" },
  { day: "quarta", time: "18:00", type: "funcional" },
  { day: "quarta", time: "19:00", type: "funcional" },
  // Quinta
  { day: "quinta", time: "06:00", type: "funcional" },
  { day: "quinta", time: "07:00", type: "funcional" },
  { day: "quinta", time: "09:00", type: "funcional" },
  { day: "quinta", time: "10:00", type: "pilates" },
  { day: "quinta", time: "16:00", type: "musculacao" },
  { day: "quinta", time: "18:00", type: "funcional" },
  { day: "quinta", time: "19:00", type: "funcional" },
  // Sexta
  { day: "sexta", time: "06:00", type: "funcional" },
  { day: "sexta", time: "07:00", type: "funcional" },
  { day: "sexta", time: "12:00", type: "hiit" },
  { day: "sexta", time: "16:00", type: "funcional-teen" },
  { day: "sexta", time: "17:00", type: "funcional" },
  // Sábado
  { day: "sabado", time: "08:00", type: "musculacao" },
  { day: "sabado", time: "09:00", type: "funcional" },
];

// Segunda a quinta seguem o mesmo padrão de horários — por isso são a base
// das opções "genéricas" oferecidas no formulário. Sexta (grade reduzida à
// noite) e sábado (só de manhã) variam e por isso ficam de fora dessa lista;
// o formulário avisa sobre essa diferença em vez de pedir para escolher o dia.
const CORE_WEEKDAYS: WeekDay[] = ["segunda", "terca", "quarta", "quinta"];

export interface GenericTimeOption {
  time: string;
  type: ClassType;
}

/**
 * Horários típicos (segunda a quinta) compatíveis com o interesse informado,
 * um por horário, ordenados. Cada horário mapeia para um único tipo de
 * treino dentro dessa janela de dias.
 */
export function getGenericTimeOptions(interest: Interest): GenericTimeOption[] {
  const allowedTypes = INTEREST_CLASS_TYPES[interest];
  const typeByTime = new Map<string, ClassType>();

  for (const slot of SCHEDULE) {
    if (!CORE_WEEKDAYS.includes(slot.day)) continue;
    if (!allowedTypes.includes(slot.type)) continue;
    typeByTime.set(slot.time, slot.type);
  }

  return [...typeByTime.entries()]
    .map(([time, type]) => ({ time, type }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

/** Tipo de treino correspondente a um horário genérico já validado. */
export function getTrainingTypeForTime(
  interest: Interest,
  time: string,
): ClassType | undefined {
  return getGenericTimeOptions(interest).find((option) => option.time === time)
    ?.type;
}
