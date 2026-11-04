import React, { useState, useEffect, useMemo } from 'react';

// --- DATA STRUCTURES e INITIAL MOCK DATA ---

const MEDICAL_AREAS = {
  clinica: {
    id: 'clinica',
    name: 'Clínica Médica',
    shortName: 'Clínica',
    color: 'from-blue-600 to-indigo-600',
    badgeBg: 'bg-blue-500/15 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-500/40',
    hexColor: '#3B82F6',
    subtopics: ['Cardiologia', 'Endocrinologia - Tireoide', 'Infectologia', 'Reumatologia', 'Nefrologia', 'Gastroenterologia', 'Pneumologia']
  },
  cirurgia: {
    id: 'cirurgia',
    name: 'Cirurgia Geral',
    shortName: 'Cirurgia',
    color: 'from-red-600 to-rose-600',
    badgeBg: 'bg-red-500/15 text-red-700 dark:bg-red-950/80 dark:text-red-300 border-red-500/40',
    hexColor: '#EF4444',
    subtopics: ['Trauma', 'Vias Biliares', 'Hérnias', 'Apêndice e Abdome Agudo', 'Oncologia Cirúrgica', 'Pós-Operatório']
  },
  go: {
    id: 'go',
    name: 'Ginecologia e Obstetrícia',
    shortName: 'G e O',
    color: 'from-pink-600 to-fuchsia-600',
    badgeBg: 'bg-pink-500/15 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300 border-pink-500/40',
    hexColor: '#EC4899',
    subtopics: ['Pré-natal', 'Sangramento 1ª Metade', 'Ginecologia Endócrina', 'Oncologia Ginecológica', 'Parto e Puerpério', 'Contracepção']
  },
  pediatria: {
    id: 'pediatria',
    name: 'Pediatria',
    shortName: 'Pediatria',
    color: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-500/40',
    hexColor: '#10B981',
    subtopics: ['Neonatologia', 'Puericultura', 'Doenças Exantemáticas', 'Respiratório Infantil', 'Nutrição e Crescimento', 'Infectopediatria']
  },
  preventiva: {
    id: 'preventiva',
    name: 'Medicina Preventiva',
    shortName: 'Preventiva',
    color: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    hexColor: '#F59E0B',
    subtopics: ['SUS e Diretrizes', 'Epidemiologia e Métrica', 'Medicina do Trabalho', 'Atenção Primária', 'Vigilância em Saúde']
  }
};

const INITIAL_QUESTIONS = [
  {
    id: 'q1',
    area: 'clinica',
    subtopic: 'Cardiologia',
    title: 'Infarto Agudo do Miocárdio com Supra de ST',
    statement: 'Homem de 62 anos, hipertenso e tabagista, chega à emergência com dor torácica retroesternal em aperto há 2 horas, irradiada para membro superior esquerdo e mandíbula. O ECG de admissão revela elevação do segmento ST de 2,5 mm nas derivações V1 a V4. Qual é a conduta prioritária e imediata?',
    options: [
      'Encaminhar para internação em UTI e aguardar resultado de curva de troponina.',
      'Reperfusão miocárdica imediata, preferencialmente por Angioplastia Coronária Primária (ICP).',
      'Realizar Ecocardiograma Transtorácico antes de definir medicação trombolítica.',
      'Prescrever Nitroglicerina sublingual e liberar para acompanhamento ambulatorial.'
    ],
    correctAnswer: 1,
    explanation: 'No IAM com supra de ST em parede anterior (V1-V4), o tempo é miocárdio. A estratégia de reperfusão coronariana imediata (ICP primária até 120 minutos do diagnóstico) é a conduta absoluta de primeira escolha para restaurar o fluxo sanguíneo.'
  },
  {
    id: 'q2',
    area: 'clinica',
    subtopic: 'Endocrinologia - Tireoide',
    title: 'Crise Tireotóxica e Manejo Clínico',
    statement: 'Paciente do sexo feminino, 34 anos, diagnosticada com Doença de Graves, evolui com febre de 39,5ºC, taquicardia (145 bpm), agitação psicomotora e icterícia leve após quadro infeccioso pulmonar. Qual a sequência medicamentosa correta no manejo inicial da Crise Tireotóxica?',
    options: [
      'Betabloqueador, Propiltiouracil (PTU), Solução de Lugol e Hidrocortisona.',
      'Apenas Levotiroxina em altas doses e hidratação venosa.',
      'Radioablação com Iodo-131 imediata na emergência.',
      'Cirurgia de tireoidectomia de urgência sem preparo prévio.'
    ],
    correctAnswer: 0,
    explanation: 'O tratamento da Crise Tireotóxica exige bloqueio dos sintomas simpáticos (Betabloqueador), inibição da síntese de hormônios (PTU/Metimazol), inibição da liberação glandular (Solução de Lugol administrada 1h após o antitireoidiano) e bloqueio da conversão periférica de T4 em T3 com Corticoide.'
  },
  {
    id: 'q3',
    area: 'cirurgia',
    subtopic: 'Trauma',
    title: 'Atendimento Inicial ao Politraumatizado (ATLS)',
    statement: 'Jovem de 24 anos é vítima de colisão auto x poste. Chega ao trauma consciente porém agitado, com saturação de O2 em 88% e esforço respiratório. Qual a primeira prioridade absoluta na avaliação primária de acordo com o protocolo ATLS?',
    options: [
      'Acesso venoso periférico calibroso para ressuscitação volêmica.',
      'Garantir via aérea pérvia com proteção e controle manual da coluna cervical.',
      'Realizar FAST (Focused Assessment with Sonography for Trauma) abdominal.',
      'Drenagem de tórax no 5º espaço intercostal imediatamente.'
    ],
    correctAnswer: 1,
    explanation: 'A etapa "A" (Airway) com controle da coluna cervical é a primeira etapa inegociável da avaliação primária do ATLS. Sem via aérea pérvia e protegida, as demais etapas perdem a eficácia.'
  },
  {
    id: 'q4',
    area: 'go',
    subtopic: 'Pré-natal',
    title: 'Rastreio e Diagnóstico de Diabetes Mellitus Gestacional',
    statement: 'Gestante de 14 semanas realiza exames de rotina do 1º trimestre. A glicemia de jejum resulta em 96 mg/dL. Qual é o diagnóstico e a conduta adequada para este caso segundo a FEBRASGO e SBD?',
    options: [
      'Exame normal. Orientar dieta habitual e repetir apenas no 3º trimestre.',
      'Diagnóstico de Diabetes Mellitus Gestacional (DMG). Iniciar orientação nutricional e atividade física.',
      'Diagnóstico de Diabetes Mellitus Oculto pré-gestacional. Iniciar insulina em dose máxima.',
      'Solicitar Curva Glicêmica (TOTG 75g) imediatamente para confirmar.'
    ],
    correctAnswer: 1,
    explanation: 'Glicemia de jejum no 1º trimestre entre 92 mg/dL e 125 mg/dL fecha o diagnóstico definitivo de Diabetes Mellitus Gestacional (DMG), sem necessidade de TOTG. A primeira linha de tratamento é a adequação alimentar e atividade física.'
  },
  {
    id: 'q5',
    area: 'pediatria',
    subtopic: 'Neonatologia',
    title: 'Cuidados Imediatos na Sala de Parto',
    statement: 'Recém-nascido a termo (39 semanas) nasce por parto vaginal, chora forte, apresenta bom tônus muscular e líquido amniótico claro. Qual a conduta recomendada para o manejo do cordão umbilical e contato inicial?',
    options: [
      'Clampeamento imediato do cordão e aspiração de vias aéreas superior.',
      'Clampeamento oportuno do cordão (1 a 3 minutos) e promoção do contato pele a pele imediato com a mãe.',
      'Levá-lo imediatamente à mesa de reanimação para colar fonte de calor radiante por 10 min.',
      'Ventilação com Pressão Positiva (VPP) preventiva por 30 segundos.'
    ],
    correctAnswer: 1,
    explanation: 'RN a termo com boa vitalidade (respirando/chorando e tônus adequado) deve ir direto para o contato pele a pele com a mãe e ter o clampeamento do cordão postergado para 1 a 3 minutos, promovendo transfusão placentária benigna.'
  },
  {
    id: 'q6',
    area: 'preventiva',
    subtopic: 'SUS e Diretrizes',
    title: 'Princípios Doutrinários do SUS (UEPA 2024)',
    statement: 'Um médico da Estratégia Saúde da Família reorganiza a agenda do posto priorizando atendimento domiciliar para idosos acamados e pacientes com maior vulnerabilidade socioeconômica. Qual princípio doutrinário do SUS está sendo aplicado?',
    options: [
      'Universalidade',
      'Equidade',
      'Integrabilidade',
      'Descentralização'
    ],
    correctAnswer: 1,
    explanation: 'A Equidade consiste em tratar desigualmente os desiguais, investindo mais onde a necessidade é maior para diminuir as disparidades sociais e em saúde.'
  },
  {
    id: 'q7',
    area: 'cirurgia',
    subtopic: 'Apêndice e Abdome Agudo',
    title: 'Apendicite Aguda e Escoragem de Alvarado',
    statement: 'Paciente masculino de 19 anos apresenta dor periumbilical que migrou para a fossa ilíaca direita há 18 horas, associada a anorexia e náuseas. Ao exame: dor à palpação do ponto de McBurney com descompressão brusca positiva (Sinal de Blumberg) e leucocitose de 14.500/mm³ com desvio à esquerda. Qual a conduta adequada?',
    options: [
      'Solicitar tomografia computadorizada de abdome para confirmação diagnóstica antes de encaminhar.',
      'Encaminhar para Apendicectomia de urgência (quadro clínico e laboratorial clássico).',
      'Prescrever sintomáticos e orientar retorno se houver febre > 39ºC.',
      'Tratar empiricamente com amoxicilina e clavulanato ambulatorialmente.'
    ],
    correctAnswer: 1,
    explanation: 'Em homens jovens com história clínica e exame físico altamente sugestivos (Sinal de Blumberg presente) e leucocitose, o diagnóstico de Apendicite Aguda é clínico e indica cirurgia imediata (Apendicectomia), sem atrasar por exames de imagem adicionais.'
  }
];

const INITIAL_FLASHCARDS = [
  {
    id: 'fc1',
    area: 'clinica',
    subtopic: 'Cardiologia',
    front: 'Qual é a tríade clássica e achados da Insuficiência Cardíaca Perfil B (Quente e Úmido)?',
    back: 'Perfusão adequada com congestão sistêmica/pulmonar. Achados: Turgência jugular, crepitantes basais, edema de MMII e ortopneia. Conduta principal: Diurético de alça venoso e vasodilatador se PA estável.',
    dueDate: new Date().toISOString().split('T')[0],
    interval: 1,
    repetitionCount: 0,
    easeFactor: 2.5
  },
  {
    id: 'fc2',
    area: 'clinica',
    subtopic: 'Endocrinologia - Tireoide',
    front: 'Como diferenciar o Hipotireoidismo Subclínico do Hipotireoidismo Primário Franco?',
    back: '• Subclínico: TSH elevado com T4 livre NORMAL (Tratar se TSH > 10, gestantes, anti-TPO alto ou sintomas graves).\n• Franco: TSH elevado com T4 livre REDUZIDO (Tratamento com Levotiroxina sempre indicado).',
    dueDate: new Date().toISOString().split('T')[0],
    interval: 1,
    repetitionCount: 0,
    easeFactor: 2.5
  },
  {
    id: 'fc3',
    area: 'clinica',
    subtopic: 'Endocrinologia - Tireoide',
    front: 'Qual o marcador anticorpo específico da Doença de Graves e da Tiroidite de Hashimoto?',
    back: '• Graves: TRAB (Anticorpo anti-receptor de TSH) - Estimulante.\n• Hashimoto: Anti-TPO (Anti-peroxidase tireoidiana) e Anti-Tireoglobulina - Destrutivos.',
    dueDate: new Date().toISOString().split('T')[0],
    interval: 1,
    repetitionCount: 0,
    easeFactor: 2.6
  },
  {
    id: 'fc4',
    area: 'cirurgia',
    subtopic: 'Vias Biliares',
    front: 'O que compõe a Tríade de Charcot e a Pêntade de Reynolds na Colangite Aguda?',
    back: '• Tríade de Charcot: Febre com calafrios + Dor no hipocôndrio direito + Icterícia.\n• Pêntade de Reynolds: Tríade de Charcot + Hipotensão (choque) + Rebaixamento do nível de consciência.',
    dueDate: new Date().toISOString().split('T')[0],
    interval: 1,
    repetitionCount: 0,
    easeFactor: 2.5
  },
  {
    id: 'fc5',
    area: 'go',
    subtopic: 'Ginecologia Endócrina',
    front: 'Quais os 3 critérios de Rotterdã para o diagnóstico da Síndrome dos Ovários Policísticos (SOP)?',
    back: 'Necessários pelo menos 2 de 3:\n1. Oligo ou anovulação (irregularidade menstrual)\n2. Sinais clínicos ou laboratoriais de hiperandrogenismo\n3. Morfologia de ovários policísticos ao ultrassom (≥20 folículos ou volume >10cm³).',
    dueDate: new Date().toISOString().split('T')[0],
    interval: 1,
    repetitionCount: 0,
    easeFactor: 2.4
  },
  {
    id: 'fc6',
    area: 'preventiva',
    subtopic: 'Epidemiologia e Métrica',
    front: 'Qual a diferença conceitual entre Risco Relativo (RR) e Odds Ratio (OR)?',
    back: '• Risco Relativo (RR): Utilizado em estudos de COORTE e Ensaios Clínicos (Incidência expostos / Incidência não expostos).\n• Odds Ratio (OR): Utilizado em estudos de CASO-CONTROLE (Razão de Chances).',
    dueDate: new Date().toISOString().split('T')[0],
    interval: 1,
    repetitionCount: 0,
    easeFactor: 2.5
  }
];

// Helper Function for Dates
function addDays(baseDate, days) {
  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

const INITIAL_CADERNO_ENTRIES = []; // O caderno começa vazio para cada novo usuário.

const INITIAL_LOGS = []; // O painel começa sem métricas fictícias.

// --- POKEMED SVG ICONS ---
const PokeMedLogo = () => (
  <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#10B981" stroke="#0284C7" strokeWidth="6" />
    <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#0284C7" />
    <line x1="4" y1="50" x2="96" y2="50" stroke="#0F172A" strokeWidth="8" />
    <circle cx="50" cy="50" r="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="6" />
    <path d="M 50 40 V 60 M 40 50 H 60" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const IconSun = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconMoon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const IconCaderno = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconQuestions = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconFlashcards = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const IconTimer = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconFlame = () => (
  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-1.348c-1.488 1.6-1.921 2.515-3.04 4.04-1.12 1.523-2.905 3.125-2.905 5.755 0 3.866 3.036 6.992 6.8 7 3.866-.008 6.8-3.134 6.8-7 0-2.316-1.025-4.048-2.432-5.462-1.36-1.365-2.73-2.146-3.773-2.985zM10 16a3.5 3.5 0 01-3.5-3.5c0-.98.375-1.874 1.15-2.712.355-.385.748-.737 1.15-1.063.29-.236.582-.468.87-.714.288.246.58.478.87.714.402.326.795.678 1.15 1.063.775.838 1.15 1.732 1.15 2.712A3.5 3.5 0 0110 16z" clipRule="evenodd" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317a1.724 1.724 0 013.35 0 1.724 1.724 0 002.573 1.066 1.724 1.724 0 012.37 2.37 1.724 1.724 0 001.066 2.573 1.724 1.724 0 010 3.35 1.724 1.724 0 00-1.066 2.573 1.724 1.724 0 01-2.37 2.37 1.724 1.724 0 00-2.573 1.066 1.724 1.724 0 01-3.35 0 1.724 1.724 0 00-2.573-1.066 1.724 1.724 0 01-2.37-2.37 1.724 1.724 0 00-1.066-2.573 1.724 1.724 0 010-3.35 1.724 1.724 0 001.066-2.573 1.724 1.724 0 012.37-2.37 1.724 1.724 0 002.573-1.066z" />
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
  </svg>
);

const IconBrain = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

// --- LOCAL STORAGE HELPERS ---
// Evita que dados corrompidos ou indisponibilidade do armazenamento impeçam a tela de abrir.
function readStoredValue(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    const saved = window.localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch (error) {
    console.warn(`Não foi possível carregar ${key}. Usando os dados iniciais.`, error);
    return fallback;
  }
}

function writeStoredValue(key, value) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn(`Não foi possível salvar ${key}.`, error);
  }
}

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    try { return typeof window !== 'undefined' ? (window.localStorage.getItem('pokemed_theme') || 'dark') : 'dark'; }
    catch { return 'dark'; }
  });
  const [toastMessage, setToastMessage] = useState(null);

  // Dados persistidos no navegador. O conteúdo é separado do histórico de desempenho.
  const [logs, setLogs] = useState(() => readStoredValue('pokemed_logs', INITIAL_LOGS));
  const [questions, setQuestions] = useState(() => readStoredValue('pokemed_questions', INITIAL_QUESTIONS));
  const [flashcards, setFlashcards] = useState(() => readStoredValue('pokemed_flashcards', INITIAL_FLASHCARDS));
  const [cadernoEntries, setCadernoEntries] = useState(() => readStoredValue('pokemed_caderno', INITIAL_CADERNO_ENTRIES));

  // Salva automaticamente as alterações no navegador.
  useEffect(() => {
    try { window.localStorage.setItem('pokemed_theme', theme); } catch (error) { console.warn('Não foi possível salvar o tema.', error); }
  }, [theme]);
  useEffect(() => writeStoredValue('pokemed_logs', logs), [logs]);
  useEffect(() => writeStoredValue('pokemed_questions', questions), [questions]);
  useEffect(() => writeStoredValue('pokemed_flashcards', flashcards), [flashcards]);
  useEffect(() => writeStoredValue('pokemed_caderno', cadernoEntries), [cadernoEntries]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Zera o desempenho e reinicia os ciclos SRS, mas mantém questões e flashcards cadastrados.
  const resetProgress = () => {
    const confirmed = window.confirm(
      'Tem certeza? Isso apagará o histórico de sessões, as métricas e o avanço das revisões. Suas questões e flashcards serão mantidos.'
    );
    if (!confirmed) return;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setLogs([]);
    setFlashcards(prev => prev.map(card => ({
      ...card,
      dueDate: todayStr,
      interval: 1,
      repetitionCount: 0,
      easeFactor: 2.5
    })));
    setCadernoEntries(prev => prev.map(entry => ({
      ...entry,
      revisions: (entry.revisions || []).map(revision => {
        const days = Number.parseInt(revision.stage, 10) || 0;
        return { ...revision, date: addDays(today, days), completed: false };
      })
    })));
    setActiveTab('settings');
    showToast('Progresso reiniciado. Seu conteúdo foi preservado!');
  };

  // Aggregated Stats
  const stats = useMemo(() => {
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalMinutes = 0;

    const areaStats = {
      clinica: { total: 0, correct: 0 },
      cirurgia: { total: 0, correct: 0 },
      go: { total: 0, correct: 0 },
      pediatria: { total: 0, correct: 0 },
      preventiva: { total: 0, correct: 0 }
    };

    logs.forEach((log) => {
      totalQuestions += log.totalQuestions;
      totalCorrect += log.correctQuestions;
      totalMinutes += log.timeMinutes;

      if (areaStats[log.area]) {
        areaStats[log.area].total += log.totalQuestions;
        areaStats[log.area].correct += log.correctQuestions;
      }
    });

    const globalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const totalHours = (totalMinutes / 60).toFixed(1);

    const todayStr = new Date().toISOString().split('T')[0];
    const dueCardsCount = flashcards.filter(c => c.dueDate <= todayStr).length;

    return {
      totalQuestions,
      totalCorrect,
      globalAccuracy,
      totalHours,
      dueCardsCount,
      areaStats
    };
  }, [logs, flashcards]);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 border border-emerald-400/40 animate-bounce">
          <IconCheck />
          <span className="font-semibold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 lg:px-8 py-3 flex items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-emerald-200/80 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <PokeMedLogo />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
                PokeMed
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Residência Studio
              </span>
            </div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
              STUDY • TRACK • MASTER
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-emerald-50 border-emerald-200 text-slate-700 hover:bg-emerald-100'
            }`}
            title="Alternar Tema Claro/Escuro"
          >
            {isDark ? <IconSun /> : <IconMoon />}
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <IconPlus />
            <span>Central de Conteúdo</span>
          </button>
        </div>
      </header>

      {/* BODY LAYOUT */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-65px)]">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className={`w-full md:w-64 border-r p-3 flex md:flex-col justify-around md:justify-start space-y-0 md:space-y-1.5 shrink-0 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-emerald-50/50 border-emerald-100'
        }`}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
            }`}
          >
            <IconDashboard />
            <span className="hidden md:inline">Dashboard e Métricas</span>
            <span className="md:hidden text-[10px]">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('caderno')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'caderno'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
            }`}
          >
            <IconCaderno />
            <span className="hidden md:inline">Caderno de Estudos</span>
            <span className="md:hidden text-[10px]">Caderno</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'questions'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
            }`}
          >
            <IconQuestions />
            <span className="hidden md:inline">Banco de Questões</span>
            <span className="md:hidden text-[10px]">Questões</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'flashcards'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <IconFlashcards />
              <span className="hidden md:inline">Flashcards (SRS)</span>
              <span className="md:hidden text-[10px]">Cards</span>
            </div>
            {stats.dueCardsCount > 0 && (
              <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {stats.dueCardsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'ai'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
            }`}
          >
            <IconBrain />
            <span className="hidden md:inline">PokeMed AI (Dúvidas)</span>
            <span className="md:hidden text-[10px]">PokeMed AI</span>
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'timer'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
            }`}
          >
            <IconTimer />
            <span className="hidden md:inline">Cronômetro e Pomodoro</span>
            <span className="md:hidden text-[10px]">Timer</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'add'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
            }`}
          >
            <IconPlus />
            <span className="hidden md:inline">Central e Importação</span>
            <span className="md:hidden text-[10px]">Importar</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800/10 dark:hover:bg-slate-800/50'
            }`}
          >
            <IconSettings />
            <span className="hidden md:inline">Configurações</span>
            <span className="md:hidden text-[10px]">Ajustes</span>
          </button>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardView stats={stats} setActiveTab={setActiveTab} logs={logs} flashcards={flashcards} isDark={isDark} />
          )}

          {activeTab === 'caderno' && (
            <CadernoView
              cadernoEntries={cadernoEntries}
              setCadernoEntries={setCadernoEntries}
              showToast={showToast}
              isDark={isDark}
            />
          )}

          {activeTab === 'questions' && (
            <QuestionsView
              questions={questions}
              isDark={isDark}
              onLogQuestionSession={(newLog) => {
                setLogs(prev => [newLog, ...prev]);
                showToast(`Sessão salva: ${newLog.correctQuestions}/${newLog.totalQuestions} acertos!`);
              }}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsView
              flashcards={flashcards}
              setFlashcards={setFlashcards}
              showToast={showToast}
              isDark={isDark}
            />
          )}

          {activeTab === 'ai' && (
            <PokeMedAiView isDark={isDark} />
          )}

          {activeTab === 'timer' && (
            <TimerView
              isDark={isDark}
              onCompleteSession={(newLog) => {
                setLogs(prev => [newLog, ...prev]);
                showToast(`Tempo registrado: ${newLog.timeMinutes} min em ${MEDICAL_AREAS[newLog.area]?.shortName}!`);
              }}
            />
          )}

          {activeTab === 'add' && (
            <AddContentView
              isDark={isDark}
              questions={questions}
              flashcards={flashcards}
              cadernoEntries={cadernoEntries}
              setQuestions={setQuestions}
              setFlashcards={setFlashcards}
              setCadernoEntries={setCadernoEntries}
              onAddLog={(newLog) => {
                setLogs(prev => [newLog, ...prev]);
                showToast("Sessão registrada com sucesso!");
                setActiveTab('dashboard');
              }}
              onAddFlashcard={(newFc) => {
                setFlashcards(prev => [newFc, ...prev]);
                showToast("Novo Flashcard adicionado ao baralho!");
                setActiveTab('flashcards');
              }}
              onAddCaderno={(newCaderno) => {
                setCadernoEntries(prev => [newCaderno, ...prev]);
                showToast("Entrada adicionada ao Caderno de Estudos com ciclo SRS!");
                setActiveTab('caderno');
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              isDark={isDark}
              logs={logs}
              questions={questions}
              flashcards={flashcards}
              cadernoEntries={cadernoEntries}
              onResetProgress={resetProgress}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ==========================================
// CONFIGURAÇÕES
// ==========================================
function SettingsView({ isDark, logs, questions, flashcards, cadernoEntries, onResetProgress }) {
  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100 shadow-sm';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className={`text-xl font-extrabold ${textTitle}`}>Configurações</h2>
        <p className="text-xs text-slate-400 mt-1">Gerencie seus dados e o progresso de estudos da PokeMed.</p>
      </div>

      <div className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
        <div>
          <h3 className={`text-sm font-extrabold ${textTitle}`}>Resumo dos seus dados</h3>
          <p className="text-xs text-slate-400 mt-1">O conteúdo cadastrado fica separado das métricas de desempenho.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Sessões', value: logs.length },
            { label: 'Questões', value: questions.length },
            { label: 'Flashcards', value: flashcards.length },
            { label: 'Assuntos', value: cadernoEntries.length }
          ].map(item => (
            <div key={item.label} className="p-3 rounded-2xl bg-slate-800/10 dark:bg-slate-950/50 border border-slate-700/20">
              <div className="text-xl font-black text-emerald-500">{item.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
        <div>
          <h3 className={`text-sm font-extrabold ${textTitle}`}>Restaurar progresso</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Apaga o histórico de sessões e zera as métricas do painel. Também reinicia o agendamento e a contagem de revisões dos flashcards e do caderno.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-700 dark:text-amber-300">
          <strong>Seus conteúdos serão preservados:</strong> questões, flashcards cadastrados e assuntos do caderno não serão excluídos.
        </div>
        <button
          type="button"
          onClick={onResetProgress}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition"
        >
          Restaurar progresso e zerar métricas
        </button>
      </div>

      <div className={`p-5 rounded-2xl border ${cardBg}`}>
        <h3 className={`text-sm font-extrabold ${textTitle}`}>Onde seus dados ficam salvos?</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Por enquanto, os dados ficam armazenados neste navegador e neste dispositivo. Limpar os dados do navegador pode apagá-los. A publicação do site, por si só, não cria uma conta nem sincroniza os dados entre dispositivos.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 1. DASHBOARD E MÉTRICAS VIEW
// ==========================================
function DashboardView({ stats, setActiveTab, logs, flashcards = [], isDark }) {
  const [period, setPeriod] = useState('semana'); // 'dia', 'semana', 'mes', 'total'

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100 shadow-sm';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-300' : 'text-slate-600';

  // Compute stats according to selected period
  const filteredStats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const isDateInPeriod = (dateStr) => {
      if (!dateStr) return false;
      if (period === 'total') return true;
      if (period === 'dia') return dateStr === todayStr;

      const d = new Date(dateStr);
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

      if (period === 'semana') return diffDays <= 7;
      if (period === 'mes') return diffDays <= 30;
      return true;
    };

    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalMinutes = 0;

    const areaStats = {
      clinica: { total: 0, correct: 0 },
      cirurgia: { total: 0, correct: 0 },
      go: { total: 0, correct: 0 },
      pediatria: { total: 0, correct: 0 },
      preventiva: { total: 0, correct: 0 }
    };

    const filteredLogs = logs.filter(log => isDateInPeriod(log.date));

    filteredLogs.forEach((log) => {
      totalQuestions += log.totalQuestions || 0;
      totalCorrect += log.correctQuestions || 0;
      totalMinutes += log.timeMinutes || 0;

      if (areaStats[log.area]) {
        areaStats[log.area].total += log.totalQuestions || 0;
        areaStats[log.area].correct += log.correctQuestions || 0;
      }
    });

    const globalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const totalHours = (totalMinutes / 60).toFixed(1);

    const dueCardsCount = flashcards.filter(c => c.dueDate <= todayStr).length;

    return {
      filteredLogs,
      totalQuestions,
      totalCorrect,
      globalAccuracy,
      totalHours,
      dueCardsCount,
      areaStats
    };
  }, [logs, flashcards, period]);

  const periodLabels = {
    dia: 'no Dia (Hoje)',
    semana: 'na Semana (Últimos 7 dias)',
    mes: 'no Mês (Últimos 30 dias)',
    total: 'no Total até o momento'
  };

  return (
    <div className="space-y-6">
      {/* BANNER WELCOME */}
      <div className={`p-6 sm:p-8 rounded-3xl border bg-gradient-to-r ${
        isDark ? 'from-slate-900 via-slate-900 to-slate-800 border-slate-800' : 'from-emerald-600 to-sky-600 text-white border-transparent'
      } relative overflow-hidden shadow-xl`}>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] tracking-wider uppercase border border-emerald-500/30">
              STUDY • TRACK • MASTER
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-white'}`}>
            Painel Geral de Desempenho
          </h2>
          <p className={`text-xs sm:text-sm max-w-xl ${isDark ? 'text-slate-300' : 'text-emerald-100'}`}>
            Acompanhe seu progresso diário nas 5 Grandes Áreas, mantenha as revisões espaçadas em dia e potencialize sua retenção para as provas de Residência.
          </p>
          
          <div className="pt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('questions')}
              className="bg-white text-emerald-950 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-md"
            >
              Fazer Questões Agora
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className="bg-emerald-900/50 hover:bg-emerald-900/70 border border-emerald-400/30 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
            >
              Revisar Flashcards ({filteredStats.dueCardsCount})
            </button>
          </div>
        </div>
      </div>

      {/* PERIOD SELECTOR CONTROLS */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${cardBg}`}>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Período de Análise:</span>
          <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {periodLabels[period]}
          </span>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-800/30 dark:bg-slate-950 border border-slate-700/40 w-full sm:w-auto">
          {[
            { id: 'dia', label: 'Hoje' },
            { id: 'semana', label: 'Semana' },
            { id: 'mes', label: 'Mês' },
            { id: 'total', label: 'Total' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                period === item.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${cardBg}`}>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Questões Feitas</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black ${textTitle}`}>{filteredStats.totalQuestions}</span>
            <span className="text-xs text-emerald-500 font-bold">({filteredStats.totalCorrect} acertos)</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${cardBg}`}>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Taxa de Acertos</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black ${textTitle}`}>{filteredStats.globalAccuracy}%</span>
            <span className="text-xs text-slate-400">no período</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${cardBg}`}>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Cards SRS Pendentes</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-amber-500">{filteredStats.dueCardsCount}</span>
            <span className="text-xs text-amber-500/80 font-semibold">para hoje</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${cardBg}`}>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Horas Estudadas</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black ${textTitle}`}>{filteredStats.totalHours}h</span>
            <span className="text-xs text-slate-400">registradas</span>
          </div>
        </div>
      </div>

      {/* 5 MAJOR AREAS BREAKDOWN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-extrabold ${textTitle}`}>Desempenho por Grande Área</h3>
          <span className="text-xs font-bold text-slate-400">Filtrado por: {periodLabels[period]}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(MEDICAL_AREAS).map(([key, area]) => {
            const areaData = filteredStats.areaStats[key] || { total: 0, correct: 0 };
            const pct = areaData.total > 0 ? Math.round((areaData.correct / areaData.total) * 100) : 0;

            return (
              <div key={key} className={`p-5 rounded-2xl border space-y-3 ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${area.badgeBg}`}>
                    {area.name}
                  </span>
                  <span className={`text-sm font-black ${textTitle}`}>{pct}%</span>
                </div>

                <div className="w-full bg-slate-700/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{areaData.total} questões resolvidas</span>
                  <span>{areaData.correct} acertos</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT LOGS FEED */}
      <div className={`p-6 rounded-3xl border ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-extrabold ${textTitle}`}>Histórico de Treinos no Período</h3>
          <span className="text-xs text-slate-400 font-semibold">{filteredStats.filteredLogs.length} sessões</span>
        </div>
        {filteredStats.filteredLogs.length === 0 ? (
          <p className="text-xs text-slate-400">Nenhum treino registrado neste período.</p>
        ) : (
          <div className="space-y-2">
            {filteredStats.filteredLogs.slice(0, 10).map((log) => {
              const areaInfo = MEDICAL_AREAS[log.area] || { name: log.area, badgeBg: '' };
              const acc = log.totalQuestions > 0 ? Math.round((log.correctQuestions / log.totalQuestions) * 100) : 0;

              return (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/10 dark:bg-slate-950/40 border border-slate-700/30 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${areaInfo.badgeBg}`}>
                      {areaInfo.name}
                    </span>
                    <span className={`font-semibold ${textSub}`}>{log.subtopic}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-slate-400">{log.timeMinutes} min</span>
                    <span className="font-bold text-emerald-500">{log.correctQuestions}/{log.totalQuestions} ({acc}%)</span>
                    <span className="text-slate-500 text-[10px]">{log.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. CADERNO DE ESTUDOS (CALENDÁRIO SRS) VIEW
// ==========================================
function CadernoView({ cadernoEntries, setCadernoEntries, showToast, isDark }) {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('all');

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100 shadow-sm';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-300' : 'text-slate-600';

  const toggleRevision = (entryId, stage) => {
    setCadernoEntries(prev => prev.map(item => {
      if (item.id === entryId) {
        const updatedRevisions = item.revisions.map(r => {
          if (r.stage === stage) {
            return { ...r, completed: !r.completed };
          }
          return r;
        });
        return { ...item, revisions: updatedRevisions };
      }
      return item;
    }));
    showToast("Status da revisão atualizado!");
  };

  const filteredEntries = cadernoEntries.filter(e => {
    if (selectedAreaFilter === 'all') return true;
    return e.area === selectedAreaFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-extrabold ${textTitle}`}>Caderno de Estudos e Cronograma SRS</h2>
          <p className="text-xs text-slate-400">
            Acompanhamento centralizado de matérias estudadas e agendamento automático de revisões (+24h, +7d, +15d, +30d)
          </p>
        </div>

        {/* AREA FILTER */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedAreaFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition whitespace-nowrap ${
              selectedAreaFilter === 'all'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Todas as Áreas
          </button>
          {Object.entries(MEDICAL_AREAS).map(([key, area]) => (
            <button
              key={key}
              onClick={() => setSelectedAreaFilter(key)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition whitespace-nowrap ${
                selectedAreaFilter === key
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {area.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* CADERNO ENTRIES LIST */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${cardBg}`}>
            <p className="text-xs font-semibold text-slate-400">Nenhum assunto registrado nesta área ainda.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const areaInfo = MEDICAL_AREAS[entry.area] || { name: entry.area, badgeBg: '' };

            return (
              <div key={entry.id} className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/20 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${areaInfo.badgeBg}`}>
                        {areaInfo.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">• {entry.subtopic}</span>
                    </div>
                    <h3 className={`text-base font-extrabold ${textTitle}`}>{entry.topicName}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Estudado em: {entry.date}</span>
                </div>

                {/* MODALITIES BADGES */}
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Modalidades:</span>
                  {entry.modalities?.teoria && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30">
                      Resumo / Teoria
                    </span>
                  )}
                  {entry.modalities?.questoes && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                      Questões
                    </span>
                  )}
                  {entry.modalities?.flashcards && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                      Flashcards
                    </span>
                  )}
                </div>

                {/* SRS REVISIONS STAGES */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ciclo de Revisão Espaçada (SRS):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {entry.revisions.map((rev) => (
                      <button
                        key={rev.stage}
                        onClick={() => toggleRevision(entry.id, rev.stage)}
                        className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                          rev.completed
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                            : isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-black block">Revisão +{rev.stage}</span>
                          <span className="text-[10px] opacity-80">{rev.date}</span>
                        </div>
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                          rev.completed ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-600'
                        }`}>
                          {rev.completed ? '✓' : ''}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. BANCO DE QUESTÕES VIEW
// ==========================================
function QuestionsView({ questions, isDark, onLogQuestionSession }) {
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedSubtopic, setSelectedSubtopic] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100 shadow-sm';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (selectedArea !== 'all' && q.area !== selectedArea) return false;
      if (selectedSubtopic !== 'all' && q.subtopic !== selectedSubtopic) return false;
      return true;
    });
  }, [questions, selectedArea, selectedSubtopic]);

  const currentQ = filteredQuestions[currentIndex] || null;

  const handleSelectOption = (idx) => {
    if (showAnswer) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setShowAnswer(true);

    // Auto-log session result
    const isCorrect = selectedOption === currentQ.correctAnswer;
    onLogQuestionSession({
      id: 'log_' + Date.now(),
      area: currentQ.area,
      subtopic: currentQ.subtopic,
      totalQuestions: 1,
      correctQuestions: isCorrect ? 1 : 0,
      timeMinutes: 2,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* FILTER BAR */}
      <div className={`p-4 rounded-2xl border space-y-3 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Grande Área</label>
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setSelectedSubtopic('all');
                setCurrentIndex(0);
                setShowAnswer(false);
                setSelectedOption(null);
              }}
              className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-emerald-200 text-slate-900'
              }`}
            >
              <option value="all">Todas as Áreas</option>
              {Object.entries(MEDICAL_AREAS).map(([key, area]) => (
                <option key={key} value={key}>{area.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtópico Específico</label>
            <select
              value={selectedSubtopic}
              onChange={(e) => {
                setSelectedSubtopic(e.target.value);
                setCurrentIndex(0);
                setShowAnswer(false);
                setSelectedOption(null);
              }}
              className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-emerald-200 text-slate-900'
              }`}
            >
              <option value="all">Todos os Subtópicos</option>
              {selectedArea !== 'all' && MEDICAL_AREAS[selectedArea]?.subtopics.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* QUESTION DISPLAY */}
      {!currentQ ? (
        <div className={`p-12 text-center rounded-3xl border ${cardBg}`}>
          <p className="text-xs text-slate-400">Nenhuma questão encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-800/20 pb-4">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${MEDICAL_AREAS[currentQ.area]?.badgeBg}`}>
                {MEDICAL_AREAS[currentQ.area]?.name}
              </span>
              <span className="text-xs font-bold text-slate-300 dark:text-slate-200 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
                {currentQ.subtopic}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Questão {currentIndex + 1} de {filteredQuestions.length}
            </span>
          </div>

          {/* TITLE e STATEMENT */}
          <div className="space-y-3">
            <h3 className={`text-base font-extrabold ${textTitle}`}>{currentQ.title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 dark:text-slate-200 font-normal">
              {currentQ.statement}
            </p>
          </div>

          {/* OPTIONS */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              let optionStyle = isDark ? 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-300';

              if (selectedOption === idx) {
                optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-300 font-bold';
              }

              if (showAnswer) {
                if (idx === currentQ.correctAnswer) {
                  optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-500 dark:text-emerald-300 font-bold';
                } else if (selectedOption === idx) {
                  optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-500 dark:text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs transition flex items-start space-x-3 ${optionStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-2">
            {!showAnswer ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                Responder
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                Próxima Questão →
              </button>
            )}
          </div>

          {/* EXPLANATION GABARITO */}
          {showAnswer && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 animate-fadeIn">
              <span className="font-extrabold text-emerald-500 block">Comentário e Gabarito Oficial:</span>
              <p className="leading-relaxed text-slate-300 dark:text-slate-200">{currentQ.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. FLASHCARDS E REPETIÇÃO ESPAÇADA (SRS) VIEW
// ==========================================
function FlashcardsView({ flashcards, setFlashcards, showToast, isDark }) {
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedSubtopic, setSelectedSubtopic] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100 shadow-sm';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';

  const filteredCards = useMemo(() => {
    return flashcards.filter(c => {
      if (selectedArea !== 'all' && c.area !== selectedArea) return false;
      if (selectedSubtopic !== 'all' && c.subtopic !== selectedSubtopic) return false;
      return true;
    });
  }, [flashcards, selectedArea, selectedSubtopic]);

  const currentCard = filteredCards[currentIndex] || null;

  const handleRateCard = (daysToAdd) => {
    if (!currentCard) return;

    const today = new Date();
    const newDueDate = addDays(today, daysToAdd);

    setFlashcards(prev => prev.map(c => {
      if (c.id === currentCard.id) {
        return {
          ...c,
          dueDate: newDueDate,
          interval: daysToAdd,
          repetitionCount: (c.repetitionCount || 0) + 1
        };
      }
      return c;
    }));

    setIsFlipped(false);
    showToast(`Card agendado para daqui a ${daysToAdd} dias!`);

    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* FILTER BAR */}
      <div className={`p-4 rounded-2xl border space-y-3 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Grande Área</label>
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setSelectedSubtopic('all');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-emerald-200 text-slate-900'
              }`}
            >
              <option value="all">Todas as Áreas</option>
              {Object.entries(MEDICAL_AREAS).map(([key, area]) => (
                <option key={key} value={key}>{area.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtópico Específico</label>
            <select
              value={selectedSubtopic}
              onChange={(e) => {
                setSelectedSubtopic(e.target.value);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-emerald-200 text-slate-900'
              }`}
            >
              <option value="all">Todos os Subtópicos</option>
              {selectedArea !== 'all' && MEDICAL_AREAS[selectedArea]?.subtopics.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* FLASHCARD INTERACTIVE FLIP CARD */}
      {!currentCard ? (
        <div className={`p-12 text-center rounded-3xl border ${cardBg}`}>
          <p className="text-xs text-slate-400">Nenhum flashcard disponível para esta seleção.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`p-8 sm:p-12 rounded-3xl border text-center cursor-pointer min-h-[260px] flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/50 ${cardBg}`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${MEDICAL_AREAS[currentCard.area]?.badgeBg}`}>
                {MEDICAL_AREAS[currentCard.area]?.name}
              </span>
              <span className="text-xs font-bold text-slate-300 dark:text-slate-200 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
                {currentCard.subtopic}
              </span>
            </div>

            <div className="my-6">
              {!isFlipped ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Frente • Clique para virar</span>
                  <p className={`text-base sm:text-lg font-bold leading-relaxed ${textTitle}`}>
                    {currentCard.front}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 animate-fadeIn">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-500">Verso • Resposta</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-200 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Card {currentIndex + 1} de {filteredCards.length}
            </div>
          </div>

          {/* SRS RATING BUTTONS */}
          {isFlipped && (
            <div className="grid grid-cols-4 gap-2 pt-2 animate-fadeIn">
              <button
                onClick={() => handleRateCard(1)}
                className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-500 hover:bg-rose-500/25 transition text-xs font-bold"
              >
                <span className="block font-black">Refazer</span>
                <span className="text-[10px] opacity-75">1 dia</span>
              </button>

              <button
                onClick={() => handleRateCard(3)}
                className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-500 hover:bg-amber-500/25 transition text-xs font-bold"
              >
                <span className="block font-black">Difícil</span>
                <span className="text-[10px] opacity-75">3 dias</span>
              </button>

              <button
                onClick={() => handleRateCard(7)}
                className="p-3 rounded-2xl bg-sky-500/15 border border-sky-500/40 text-sky-500 hover:bg-sky-500/25 transition text-xs font-bold"
              >
                <span className="block font-black">Bom</span>
                <span className="text-[10px] opacity-75">7 dias</span>
              </button>

              <button
                onClick={() => handleRateCard(14)}
                className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/25 transition text-xs font-bold"
              >
                <span className="block font-black">Fácil</span>
                <span className="text-[10px] opacity-75">14 dias</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. POKEMED AI - CLINICAL QA ASSISTANT
// ==========================================
function PokeMedAiView({ isDark }) {
  const [selectedSource, setSelectedSource] = useState('sus');
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100 shadow-sm';
  const inputBg = isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-emerald-200 text-slate-900';

  const sources = [
    { id: 'sus', label: 'Ministério da Saúde e SUS', icon: '🇧🇷' },
    { id: 'diretrizes', label: 'Diretrizes Brasileiras', icon: '📚' },
    { id: 'pubmed', label: 'OpenEvidence e PubMed', icon: '🔬' },
    { id: 'uptodate', label: 'UpToDate e Sociedades', icon: '🩺' }
  ];

  const presets = [
    { title: "Manejo da Crise Asmática Grave no Adulto", topic: "Clínica / Pneumologia" },
    { title: "Tratamento de Segunda Linha na Hipertensão Resistente", topic: "Clínica / Cardiologia" },
    { title: "Investigação de Nódulo de Tireoide e Bethesda", topic: "Cirurgia / Endocrinologia" },
    { title: "Esquema Terapêutico da Preeclampsia e Sulfatação", topic: "Ginecologia e Obstetrícia" },
    { title: "Manejo da Dengue e Estadiamento de Gravidade (A, B, C, D)", topic: "Infectologia / Preventiva" }
  ];

  const handlePresetClick = (presetTitle) => {
    setUserQuery(presetTitle);
    executeSearch(presetTitle);
  };

  const executeSearch = async (queryText = userQuery) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setResponse(null);

    const activeSourceObj = sources.find(s => s.id === selectedSource)?.label || 'Diretrizes Médicas';


    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, source: activeSourceObj })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Falha na consulta');
      const generatedText = data?.text;

      if (generatedText) {
        setResponse({ text: generatedText, source: activeSourceObj });
      } else {
        throw new Error("Formato de resposta inesperado");
      }
    } catch (err) {
      console.error("Falha na integração com a IA:", err);
      setResponse({
        text: 'Não foi possível consultar a inteligência artificial agora. Verifique a configuração da integração e tente novamente.',
        source: 'Falha na consulta'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER BANNER */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            <IconBrain />
          </div>
          <div>
            <h2 className="text-xl font-extrabold flex items-center space-x-2">
              <span>PokeMed AI</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
                Evidência e Diretrizes
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Tire dúvidas médicas de alta complexidade com suporte das diretrizes brasileiras e internacionais
            </p>
          </div>
        </div>

        {/* SOURCE SELECTOR TOGGLES */}
        <div className="mt-4 pt-4 border-t border-slate-800/20">
          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Fonte Principal Recomendada para a Consulta:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sources.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSource(s.id)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2 text-xs font-bold ${
                  selectedSource === s.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span>{s.icon}</span>
                <span className="truncate">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK PRESETS */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Tópicos de Alta Incidência em Provas:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(p.title)}
              className={`text-xs px-3 py-2 rounded-xl border transition text-left font-semibold ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-white'
                  : 'bg-white border-emerald-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50'
              }`}
            >
              <span className="text-emerald-500 font-bold mr-1.5">•</span>
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT SEARCH BOX */}
      <div className={`p-4 rounded-2xl border space-y-3 ${cardBg}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
            placeholder="Digite sua dúvida médica (ex: Qual o esquema de desmame de corticoide na Asma grave?)..."
            className={`flex-1 text-xs sm:text-sm p-3.5 rounded-xl border outline-none font-medium ${inputBg}`}
          />
          <button
            onClick={() => executeSearch()}
            disabled={isLoading || !userQuery.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition shadow-md shadow-emerald-600/20 shrink-0"
          >
            {isLoading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </div>

      {/* RESPONSE DISPLAY */}
      {isLoading && (
        <div className={`p-12 text-center rounded-3xl border ${cardBg}`}>
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold text-slate-400">Sintetizando evidências e esquemas terapêuticos...</p>
        </div>
      )}

      {response && !isLoading && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b border-slate-800/20 pb-3">
            <span className="text-xs font-bold text-emerald-500 flex items-center space-x-1">
              <IconCheck />
              <span>Resposta Estruturada por Inteligência Clínica</span>
            </span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700">
              {response.source}
            </span>
          </div>

          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal space-y-3">
            {response.text}
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 6. CRONÔMETRO E POMODORO VIEW
// ==========================================
function TimerView({ isDark, onCompleteSession }) {
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' or 'stopwatch'
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedArea, setSelectedArea] = useState('clinica');
  const [selectedSubtopic, setSelectedSubtopic] = useState(MEDICAL_AREAS.clinica.subtopics[0]);

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100 shadow-sm';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (mode === 'pomodoro') {
            if (prev <= 1) {
              clearInterval(interval);
              setIsActive(false);
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, mode]);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(mode === 'pomodoro' ? 25 * 60 : 0);
  };

  const handleSaveTimerSession = () => {
    const minutesSpent = Math.max(1, Math.round((mode === 'pomodoro' ? (25 * 60 - secondsLeft) : secondsLeft) / 60));
    onCompleteSession({
      id: 'log_' + Date.now(),
      area: selectedArea,
      subtopic: selectedSubtopic,
      totalQuestions: 0,
      correctQuestions: 0,
      timeMinutes: minutesSpent,
      date: new Date().toISOString().split('T')[0]
    });
    handleReset();
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center">
      <div className={`p-8 sm:p-12 rounded-3xl border space-y-6 ${cardBg}`}>
        {/* MODE TOGGLE */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-800/20 border border-slate-700/30">
          <button
            onClick={() => {
              setMode('pomodoro');
              setIsActive(false);
              setSecondsLeft(25 * 60);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'pomodoro' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Pomodoro (25 min)
          </button>
          <button
            onClick={() => {
              setMode('stopwatch');
              setIsActive(false);
              setSecondsLeft(0);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'stopwatch' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Cronômetro Livre
          </button>
        </div>

        {/* TIMER DISPLAY */}
        <div className="py-4">
          <span className={`text-6xl sm:text-7xl font-black tracking-tight font-mono ${textTitle}`}>
            {formatTime(secondsLeft)}
          </span>
        </div>

        {/* AREA e SUBTOPIC SELECTION */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Grande Área</label>
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setSelectedSubtopic(MEDICAL_AREAS[e.target.value].subtopics[0]);
              }}
              className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-emerald-200 text-slate-900'
              }`}
            >
              {Object.entries(MEDICAL_AREAS).map(([key, area]) => (
                <option key={key} value={key}>{area.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtópico</label>
            <select
              value={selectedSubtopic}
              onChange={(e) => setSelectedSubtopic(e.target.value)}
              className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-emerald-200 text-slate-900'
              }`}
            >
              {MEDICAL_AREAS[selectedArea]?.subtopics.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            {isActive ? 'Pausar' : 'Iniciar Foco'}
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-5 py-3.5 rounded-xl transition"
          >
            Zerar
          </button>
          <button
            onClick={handleSaveTimerSession}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-5 py-3.5 rounded-xl transition shadow-md shadow-sky-600/20"
          >
            Salvar Tempo
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. CENTRAL DE CONTEÚDO E IMPORTAÇÃO EM LOTE
// ==========================================
function AddContentView({ isDark, questions, flashcards, cadernoEntries, setQuestions, setFlashcards, setCadernoEntries, onAddLog, onAddFlashcard, onAddCaderno, showToast }) {
  const [mode, setMode] = useState('caderno');
  const [importJsonText, setImportJsonText] = useState('');

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100 shadow-sm';
  const inputBg = isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-emerald-200 text-slate-800';

  // Caderno Form State
  const [cadTopic, setCadTopic] = useState('');
  const [cadArea, setCadArea] = useState('clinica');
  const [cadSubtopic, setCadSubtopic] = useState(MEDICAL_AREAS.clinica.subtopics[0]);
  const [modTeoria, setModTeoria] = useState(true);
  const [modQuestoes, setModQuestoes] = useState(true);
  const [modFlashcards, setModFlashcards] = useState(false);

  // Flashcard Form State
  const [fcArea, setFcArea] = useState('clinica');
  const [fcSubtopic, setFcSubtopic] = useState(MEDICAL_AREAS.clinica.subtopics[0]);
  const [fcFront, setFcFront] = useState('');
  const [fcBack, setFcBack] = useState('');

  const handleCadernoSubmit = (e) => {
    e.preventDefault();
    if (!cadTopic.trim()) return;

    const today = new Date();
    onAddCaderno({
      id: 'cad_' + Date.now(),
      topicName: cadTopic.trim(),
      area: cadArea,
      subtopic: cadSubtopic,
      date: today.toISOString().split('T')[0],
      modalities: { teoria: modTeoria, questoes: modQuestoes, flashcards: modFlashcards },
      revisions: [
        { stage: '24h', date: addDays(today, 1), completed: false },
        { stage: '7d', date: addDays(today, 7), completed: false },
        { stage: '15d', date: addDays(today, 15), completed: false },
        { stage: '30d', date: addDays(today, 30), completed: false }
      ]
    });
    setCadTopic('');
  };

  const handleFlashcardSubmit = (e) => {
    e.preventDefault();
    if (!fcFront.trim() || !fcBack.trim()) return;

    onAddFlashcard({
      id: 'fc_' + Date.now(),
      area: fcArea,
      subtopic: fcSubtopic,
      front: fcFront,
      back: fcBack,
      dueDate: new Date().toISOString().split('T')[0],
      interval: 1,
      repetitionCount: 0,
      easeFactor: 2.5
    });
    setFcFront('');
    setFcBack('');
  };

  const handleBatchImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0];
        if (first && first.statement && first.options) {
          setQuestions(prev => [...parsed, ...prev]);
          showToast(`Importadas ${parsed.length} questões com sucesso!`);
        } else if (first && first.front && first.back) {
          setFlashcards(prev => [...parsed, ...prev]);
          showToast(`Importados ${parsed.length} flashcards com sucesso!`);
        } else {
          showToast("Estrutura JSON não reconhecida. Verifique as chaves.");
        }
        setImportJsonText('');
      } else {
        showToast("O arquivo deve conter uma lista JSON com pelo menos um item ([...]).");
      }
    } catch (err) {
      showToast("Erro ao interpretar JSON. Verifique a sintaxe.");
    }
  };

  const handleLoadUepaPreset = () => {
    const uepaPack = [
      {
        id: 'uepa_1',
        area: 'preventiva',
        subtopic: 'Epidemiologia e Métrica',
        title: 'Prova UEPA 2024 - Medidas de Associação',
        statement: 'Em um estudo de Coorte acompanhando 1.000 pacientes hipertensos por 5 anos, observou-se incidência de AVC de 8% nos expostos a controle inadequado e 2% nos controlados. Qual o Risco Relativo (RR)?',
        options: ['RR = 2,0', 'RR = 4,0', 'RR = 0,5', 'RR = 8,0'],
        correctAnswer: 1,
        explanation: 'Risco Relativo (RR) = Incidência nos Expostos (8%) / Incidência nos Não Expostos (2%) = 4,0. Significa que o risco de AVC é 4 vezes maior no grupo mal controlado.'
      },
      {
        id: 'uepa_2',
        area: 'cirurgia',
        subtopic: 'Hérnias',
        title: 'Prova UEPA 2024 - Hérnia Inguinal na Emergência',
        statement: 'Homem de 58 anos apresenta abaulamento doloroso em região inguinal direita há 6 horas, que não reduz à manobra manual. Apresenta náuseas e dor em cólica. À inspeção: abaulamento tenso, avermelhado e muito doloroso. Qual a conduta?',
        options: [
          'Tentar redução forçada sob analgesia potente com opioide.',
          'Encaminhar para Cirurgia de Urgência (Hérnia Inguinal Encarcerada/Estrangulada).',
          'Solicitar ultrassonografia inguinal e agendar eletivamente.',
          'Prescrever antibiótico e alta com sintomáticos.'
        ],
        correctAnswer: 1,
        explanation: 'Hérnia inguinal não redutível com sinais de sofrimento vascular ou encarceramento agudo é emergência cirúrgica imediata.'
      }
    ];

    setQuestions(prev => [...uepaPack, ...prev]);
    showToast("Pacote UEPA 2024 carregado no Banco de Questões!");
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      questions,
      flashcards,
      cadernoEntries
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pokemed_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Backup baixado com sucesso!");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* MODE SELECTOR */}
      <div className={`p-1.5 rounded-2xl border flex ${cardBg}`}>
        <button
          onClick={() => setMode('caderno')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
            mode === 'caderno' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Novo Assunto (Caderno SRS)
        </button>
        <button
          onClick={() => setMode('flashcard')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
            mode === 'flashcard' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Criar Flashcard
        </button>
        <button
          onClick={() => setMode('import')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
            mode === 'import' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Importar Provas (JSON)
        </button>
      </div>

      {mode === 'caderno' && (
        <form onSubmit={handleCadernoSubmit} className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
          <h3 className="font-bold text-sm">Registrar Assunto no Caderno de Estudos</h3>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Nome do Assunto Estudado</label>
            <input
              type="text"
              placeholder="Ex: Doenças da Tireoide, Insuficiência Cardíaca, Preeclampsia..."
              value={cadTopic}
              onChange={(e) => setCadTopic(e.target.value)}
              className={`w-full text-xs p-3 rounded-xl border outline-none font-semibold ${inputBg}`}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Grande Área</label>
              <select
                value={cadArea}
                onChange={(e) => {
                  setCadArea(e.target.value);
                  setCadSubtopic(MEDICAL_AREAS[e.target.value].subtopics[0]);
                }}
                className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${inputBg}`}
              >
                {Object.entries(MEDICAL_AREAS).map(([key, area]) => (
                  <option key={key} value={key}>{area.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtópico</label>
              <select
                value={cadSubtopic}
                onChange={(e) => setCadSubtopic(e.target.value)}
                className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${inputBg}`}
              >
                {MEDICAL_AREAS[cadArea]?.subtopics.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-2">Modalidades Realizadas Hoje</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={modTeoria}
                  onChange={(e) => setModTeoria(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Teoria e Resumo</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={modQuestoes}
                  onChange={(e) => setModQuestoes(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Banco de Questões</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={modFlashcards}
                  onChange={(e) => setModFlashcards(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Flashcards</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
          >
            Gerar Cronograma SRS e Cadastrar
          </button>
        </form>
      )}

      {mode === 'flashcard' && (
        <form onSubmit={handleFlashcardSubmit} className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
          <h3 className="font-bold text-sm">Novo Flashcard Personalizado</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Grande Área</label>
              <select
                value={fcArea}
                onChange={(e) => {
                  setFcArea(e.target.value);
                  setFcSubtopic(MEDICAL_AREAS[e.target.value].subtopics[0]);
                }}
                className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${inputBg}`}
              >
                {Object.entries(MEDICAL_AREAS).map(([key, area]) => (
                  <option key={key} value={key}>{area.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtópico</label>
              <select
                value={fcSubtopic}
                onChange={(e) => setFcSubtopic(e.target.value)}
                className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${inputBg}`}
              >
                {MEDICAL_AREAS[fcArea]?.subtopics.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Frente (Pergunta)</label>
            <textarea
              rows={3}
              value={fcFront}
              onChange={(e) => setFcFront(e.target.value)}
              placeholder="Ex: Qual o tratamento de primeira escolha na Preeclampsia grave com PA ≥ 160/110?"
              className={`w-full text-xs p-3 rounded-xl border outline-none font-semibold ${inputBg}`}
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Verso (Resposta)</label>
            <textarea
              rows={4}
              value={fcBack}
              onChange={(e) => setFcBack(e.target.value)}
              placeholder="Ex: Anti-hipertensivo venoso imediato + Sulfato de Magnésio."
              className={`w-full text-xs p-3 rounded-xl border outline-none font-semibold ${inputBg}`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
          >
            Adicionar Flashcard
          </button>
        </form>
      )}

      {mode === 'import' && (
        <div className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b border-slate-800/20 pb-3">
            <div>
              <h3 className="font-bold text-sm">Importação de Provas e Flashcards em Lote</h3>
              <p className="text-xs text-slate-400">Cole uma lista estruturada em formato JSON para integrar à PokeMed</p>
            </div>
            <button
              onClick={handleLoadUepaPreset}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-sky-500/15 text-sky-500 border border-sky-500/30 hover:bg-sky-500/25 transition"
            >
              + Prova UEPA 2024
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Conteúdo JSON da Prova / Deck</label>
            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='[ { "title": "Questão 1", "statement": "...", "options": ["A","B","C","D"], "correctAnswer": 0, "area": "clinica", "subtopic": "Cardiologia" } ]'
              className={`w-full text-xs p-3 font-mono rounded-xl border outline-none ${inputBg}`}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleBatchImport}
              disabled={!importJsonText.trim()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
            >
              Processar Importação JSON
            </button>
            <button
              onClick={handleExportBackup}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition"
            >
              Exportar Backup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}