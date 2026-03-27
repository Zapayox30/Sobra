export type Locale = 'es' | 'en'

export interface Translations {
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    add: string
    loading: string
    error: string
    success: string
    confirm: string
  }
  nav: {
    dashboard: string
    incomes: string
    expenses: string
    commitments: string
    settings: string
    creditCards: string
    accounts: string
    debts: string
    savings: string
    bankConnections: string
    emergencyFund: string
    investments: string
    education: string
    logout: string
  }
  settings: {
    title: string
    subtitle: string
    profile: string
    language: string
    languageDescription: string
    preferences: string
    landingTitle: string
    landingDescription: string
    landingButton: string
  }
  dashboard: {
    title: string
    subtitle: string
    leftover: string
    afterPersonal: string
    dailySuggestion: string
    perDay: string
    remainingDays: string
    incomeTotal: string
    fixedExpenses: string
    commitments: string
    personalBudget: string
    cardDue: string
    cardMinimumDue: string
    cardNextDue: string
    cardOverdue: string
    cardDueSoon: string
    calculation: string
    monthlyBreakdown: string
    totalIncomes: string
    fixedExpensesLabel: string
    monthlyCommitments: string
    leftoverBeforePersonal: string
    personalBudgetLabel: string
    percentageOfIncome: string
    noIncome: string
    scheduledSavings: string
    variableExpenses: string
    sobraMensual: string
    sobraSubtitle: string
    grossSurplus: string
    netSurplus: string
    surplusSafe: string
    surplusOperative: string
    surplusUnavailable: string
    consolidatedBalance: string
    debtsLabel: string
    savingsLabel: string
    surplusTrend: string
    surplusTrendSubtitle: string
    accountsAndWallets: string
    noSurplusData: string
    investable: string
    operationalBuffer: string
    emergencyReserve: string
  }
  incomes: {
    title: string
    subtitle: string
    manageIncome: string
    addIncome: string
    newIncome: string
    totalActive: string
    balance: string
    negativeBalance: string
    positiveBalance: string
    activeSources: string
    negativeAlertTitle: string
    negativeAlertMessage: string
    totalExpenses: string
    deficit: string
    suggestion: string
    noIncomes: string
    noIncomesDescription: string
  }
  expenses: {
    title: string
    subtitle: string
    fixed: string
    personal: string
    addFixed: string
    addPersonal: string
    newFixed: string
    newPersonal: string
    noFixed: string
    noFixedDescription: string
    noPersonal: string
    noPersonalDescription: string
  }
  commitments: {
    title: string
    subtitle: string
    addCommitment: string
    newCommitment: string
    total: string
    noCommitments: string
    noCommitmentsDescription: string
  }
  profile: {
    title: string
    subtitle: string
    personalInfo: string
    currency: string
    period: string
    monthly: string
    biweekly: string
    currentPlan: string
    plan: string
    status: string
    active: string
  }
  auth: {
    login: string
    register: string
    email: string
    password: string
    confirmPassword: string
    fullName: string
    forgotPassword: string
    noAccount: string
    hasAccount: string
    welcomeBack: string
    createAccount: string
    loginToAccount: string
    loggingIn: string
    registering: string
    creatingAccount: string
    accountCreated: string
    redirecting: string
    signUpError: string
    loginError: string
  }
  landing: {
    heroTitle: string
    heroSubtitle: string
    heroDescription: string
    ctaStart: string
    ctaLogin: string
    free: string
    noCreditCard: string
    quickSetup: string
    whyChoose: string
    whyChooseSubtitle: string
    howItWorks: string
    howItWorksSubtitle: string
    step1Title: string
    step1Description: string
    step2Title: string
    step2Description: string
    step3Title: string
    step3Description: string
    step4Title: string
    step4Description: string
    free100: string
    free100Description: string
    superFast: string
    superFastDescription: string
    totalControl: string
    totalControlDescription: string
    privacyTitle: string
    privacyDescription: string
    screenshotTitle: string
    screenshotSubtitle: string
    testimonialTitle: string
    testimonialSubtitle: string
    testimonial1Quote: string
    testimonial1Name: string
    testimonial2Quote: string
    testimonial2Name: string
    exampleMonthly: string
    exampleDaily: string
    faq: string
    faqSubtitle: string
    faq1Question: string
    faq1Answer: string
    faq2Question: string
    faq2Answer: string
    faq3Question: string
    faq3Answer: string
    faq4Question: string
    faq4Answer: string
    ctaTitle: string
    ctaDescription: string
    ctaButton: string
    // 5 Pillars
    pillarsTitle: string
    pillarsSubtitle: string
    pillar1Title: string
    pillar1Description: string
    pillar2Title: string
    pillar2Description: string
    pillar3Title: string
    pillar3Description: string
    pillar4Title: string
    pillar4Description: string
    pillar5Title: string
    pillar5Description: string
    pillar6Title: string
    pillar6Description: string
    pillar6Badge: string
    // Dashboard preview
    previewTitle: string
    previewSubtitle: string
    previewIncome: string
    previewFixed: string
    previewDebts: string
    previewSavings: string
    previewPersonal: string
    previewCards: string
    previewSurplus: string
    previewDaily: string
    // Perú focus
    peruTitle: string
    peruSubtitle: string
    peruBank1: string
    peruBank2: string
    peruBank3: string
    peruBank4: string
    peruWallet1: string
    peruWallet2: string
    peruCurrency: string
    // Extra testimonial
    testimonial3Quote: string
    testimonial3Name: string
  }
  onboarding: {
    welcome: string
    setupProfile: string
    currency: string
    period: string
    initialIncome: string
    initialIncomeLabel: string
    optional: string
    getStarted: string
    creating: string
  }
  educationPage: {
    title: string
    subtitle: string
    relevantCount: string
    activeTips: string
    ratedTips: string
    dismissedTips: string
    allCategories: string
    savings: string
    debt: string
    investment: string
    emergency: string
    spending: string
    general: string
    showDismissed: string
    hideDismissed: string
    resetAll: string
    noTips: string
    noTipsCategory: string
    tryOtherCategory: string
    tryShowDismissed: string
    useful: string
    notUseful: string
    isUseful: string
    dismiss: string
    restore: string
  }
  emergencyPage: {
    title: string
    subtitle: string
    healthNone: string
    healthCritical: string
    healthBuilding: string
    healthHealthy: string
    healthStrong: string
    monthsCovered: string
    saved: string
    ofSuggested: string
    goal: string
    monthlyFixed: string
    suggestedRange: string
    suggestedContribution: string
    ofYourSurplus: string
    monthsToComplete: string
    completed: string
    months: string
    stepsTitle: string
    stepsSubtitle: string
    stepCreate: string
    stepCreateDesc: string
    stepOneMonth: string
    stepThreeMonths: string
    stepSixMonths: string
    createFund: string
    createFundDesc: string
    fundName: string
    targetAmount: string
    monthlyContribution: string
    create: string
    creating: string
    addContribution: string
    addContributionDesc: string
    currentAmount: string
    addAmount: string
    save: string
    saving: string
    whereToKeep: string
    whereToKeepDesc: string
    whereItem1: string
    whereItem2: string
    whereItem3: string
    whereNote: string
    whenToUse: string
    whenToUseDesc: string
    whenItem1: string
    whenItem2: string
    whenItem3: string
    debtWarning: string
    noDebtMessage: string
    goToSavings: string
  }
  investmentsPage: {
    title: string
    subtitle: string
    readyTitle: string
    notReadyTitle: string
    readyDesc: string
    notReadyDesc: string
    checkPositiveSurplus: string
    checkEmergencyStarted: string
    checkOneMonth: string
    checkThreeMonths: string
    checkDebtsControlled: string
    tipPositive: string
    tipEmergency: string
    tipOneMonth: string
    tipThreeMonths: string
    tipDebts: string
    goToEmergency: string
    investableAmount: string
    investableDesc: string
    positiveMonths: string
    consecutive: string
    availableProducts: string
    referenceForPeru: string
    simulatorTitle: string
    simulatorDesc: string
    initialAmount: string
    monthlyContribution: string
    annualRate: string
    years: string
    useMyAmount: string
    totalAccumulated: string
    totalContributed: string
    interestEarned: string
    quarterlyEvolution: string
    riskLabel: string
    liquidityLabel: string
    annual: string
    minimum: string
    simulate: string
    disclaimerTitle: string
    disclaimerText: string
  }
  bankPage: {
    title: string
    subtitle: string
    poweredBy: string
    poweredByDesc: string
    encrypted: string
    regulated: string
    availableBanks: string
    connected: string
    available: string
    connect: string
    comingSoon: string
    comingSoonDesc: string
    yourConnections: string
    noConnections: string
    noConnectionsDesc: string
    goToAccounts: string
    lastSync: string
    statusActive: string
    statusReauth: string
    statusRevoked: string
    disconnect: string
    disconnectConfirm: string
    docsTitle: string
    docsDesc: string
  }
  surplusSave: {
    title: string
    description: string
    updateNote: string
    saving: string
    save: string
    goToCards: string
    analyticsTitle: string
    analyticsDesc: string
    viewAnalytics: string
    accounts: string
    wallets: string
  }
}

export const translations: Record<Locale, Translations> = {
  es: {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Agregar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      confirm: 'Confirmar',
    },
    nav: {
      dashboard: 'Dashboard',
      incomes: 'Ingresos',
      expenses: 'Gastos',
      commitments: 'Compromisos',
      creditCards: 'Tarjetas',
      accounts: 'Cuentas',
      debts: 'Deudas',
      savings: 'Metas de Ahorro',
      bankConnections: 'Bancos',
      emergencyFund: 'Fondo de Emergencia',
      investments: 'Inversiones',
      education: 'Educación',
      settings: 'Configuración',
      logout: 'Salir',
    },
    settings: {
      title: 'Configuración',
      subtitle: 'Gestiona tu perfil y preferencias',
      profile: 'Perfil',
      language: 'Idioma',
      languageDescription: 'Selecciona el idioma de la aplicación',
      preferences: 'Preferencias',
      landingTitle: 'Ver página principal',
      landingDescription: 'Abre la página pública de SOBRA para compartirla o revisarla.',
      landingButton: 'Ir a sobra.app',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Vista general de tus finanzas',
      leftover: 'Lo que te SOBRA',
      afterPersonal: 'Después de gastos personales',
      dailySuggestion: 'Sugerencia diaria',
      perDay: '/ día',
      remainingDays: 'Días restantes',
      incomeTotal: 'Ingresos Totales',
      fixedExpenses: 'Gastos Fijos',
      commitments: 'Compromisos',
      personalBudget: 'Presupuesto Personal',
      cardDue: 'Pago tarjeta (mes)',
      cardMinimumDue: 'Pago mínimo',
      cardNextDue: 'Próximo vencimiento',
      cardOverdue: 'Tienes pagos de tarjeta vencidos',
      cardDueSoon: 'Pago de tarjeta vence pronto',
      calculation: 'Cálculo',
      monthlyBreakdown: 'Desglose Mensual',
      totalIncomes: 'Ingresos totales',
      fixedExpensesLabel: 'Gastos fijos',
      monthlyCommitments: 'Compromisos mensuales',
      leftoverBeforePersonal: 'Sobrante antes de personales',
      personalBudgetLabel: 'Presupuesto personal',
      percentageOfIncome: '% del ingreso',
      noIncome: 'Sin ingresos',
      scheduledSavings: 'Ahorros programados',
      variableExpenses: 'Gastos variables',
      sobraMensual: 'Tu SOBRA mensual',
      sobraSubtitle: 'Lo que realmente te queda este mes',
      grossSurplus: 'Sobra bruta',
      netSurplus: 'Sobra neta',
      surplusSafe: 'Sobra segura',
      surplusOperative: 'Sobra operativa',
      surplusUnavailable: 'Reserva',
      consolidatedBalance: 'Saldo consolidado',
      debtsLabel: 'Deudas',
      savingsLabel: 'Ahorro comprometido',
      surplusTrend: 'Tendencia',
      surplusTrendSubtitle: 'Evolución de tu sobra mensual',
      accountsAndWallets: 'Cuentas y billeteras',
      noSurplusData: 'Aún no hay datos de sobra',
      investable: 'Invertible',
      operationalBuffer: 'Buffer operativo',
      emergencyReserve: 'Reserva de emergencia',
    },
    incomes: {
      title: 'Ingresos',
      subtitle: 'Gestiona tus ingresos mensuales',
      manageIncome: 'Gestiona tus fuentes de ingreso',
      addIncome: 'Agregar Ingreso',
      newIncome: 'Nuevo Ingreso',
      totalActive: 'Ingresos Mensuales Totales',
      balance: 'Balance Después de Gastos',
      negativeBalance: '¡Estás gastando más de lo que ganas!',
      positiveBalance: '¡Bien! Tu presupuesto está equilibrado',
      activeSources: 'fuente(s) activa(s)',
      negativeAlertTitle: '¡Atención! Presupuesto en Negativo',
      negativeAlertMessage:
        'Tus gastos totales ({totalExpenses}) superan tus ingresos ({totalIncome}). Déficit: {deficit}. Considera reducir gastos o buscar ingresos adicionales.',
      totalExpenses: 'Total de gastos',
      deficit: 'Déficit',
      suggestion: 'Considera reducir gastos o buscar ingresos adicionales para equilibrar tu presupuesto.',
      noIncomes: 'No hay ingresos',
      noIncomesDescription: 'Agrega tus fuentes de ingreso para comenzar a gestionar tus finanzas.',
    },
    expenses: {
      title: 'Gastos',
      subtitle: 'Gestiona tus gastos fijos y presupuestos personales',
      fixed: 'Gastos Fijos',
      personal: 'Presupuestos Personales',
      addFixed: 'Agregar Gasto Fijo',
      addPersonal: 'Agregar Presupuesto Personal',
      newFixed: 'Nuevo Gasto Fijo',
      newPersonal: 'Nuevo Presupuesto Personal',
      noFixed: 'No hay gastos fijos',
      noFixedDescription: 'Agrega tus gastos fijos recurrentes como alquiler, servicios, etc.',
      noPersonal: 'No hay presupuestos personales',
      noPersonalDescription: 'Agrega presupuestos para gastos variables como comida, entretenimiento, etc.',
    },
    commitments: {
      title: 'Compromisos',
      subtitle: 'Gestiona tus compromisos financieros mensuales',
      addCommitment: 'Agregar Compromiso',
      newCommitment: 'Nuevo Compromiso',
      total: 'Total de Compromisos',
      noCommitments: 'No hay compromisos',
      noCommitmentsDescription: 'Agrega compromisos financieros como ahorros o pagos programados.',
    },
    profile: {
      title: 'Perfil',
      subtitle: 'Gestiona tu información personal y preferencias',
      personalInfo: 'Información Personal',
      currency: 'Moneda',
      period: 'Periodo',
      monthly: 'Mensual',
      biweekly: 'Quincenal',
      currentPlan: 'Plan Actual',
      plan: 'Plan',
      status: 'Estado',
      active: 'Activo',
    },
    auth: {
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      fullName: 'Nombre Completo',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      welcomeBack: '¡Bienvenido de vuelta!',
      createAccount: 'Crea tu cuenta para comenzar',
      loginToAccount: 'Inicia sesión en tu cuenta',
      loggingIn: 'Iniciando sesión...',
      registering: 'Registrándose...',
      creatingAccount: 'Creando cuenta...',
      accountCreated: '¡Cuenta creada! Redirigiendo...',
      redirecting: 'Redirigiendo...',
      signUpError: 'Error al registrarse',
      loginError: 'Error al iniciar sesión',
    },
    landing: {
      heroTitle: 'Tu dinero, en orden. Tu vida, en calma.',
      heroSubtitle: 'Finanzas personales para Perú',
      heroDescription:
        'SOBRA calcula cuánto te queda cada mes después de ingresos, gastos, deudas y compromisos. Te dice exactamente cuánto puedes gastar por día. Así de simple.',
      ctaStart: 'Comenzar Gratis 🚀',
      ctaLogin: 'Iniciar Sesión',
      free: 'Gratis para siempre',
      noCreditCard: 'Sin tarjeta requerida',
      quickSetup: 'Listo en 2 minutos',
      whyChoose: '¿Por qué elegir SOBRA?',
      whyChooseSubtitle: 'Todo lo que necesitas para tomar control de tu dinero, en un solo lugar',
      howItWorks: '¿Cómo funciona?',
      howItWorksSubtitle: '4 pasos. 2 minutos. Control total.',
      step1Title: '1. Registra tus ingresos',
      step1Description: 'Sueldo, freelance, extras. Todo suma. SOBRA los organiza automáticamente por mes.',
      step2Title: '2. Agrega tus gastos',
      step2Description: 'Gastos fijos (alquiler, luz, internet) y presupuestos personales (comida, transporte, ocio).',
      step3Title: '3. Define compromisos y deudas',
      step3Description: 'Tarjetas de crédito, préstamos, cuotas. SOBRA descuenta todo antes de calcular tu sobra.',
      step4Title: '4. Ve cuánto te SOBRA',
      step4Description: 'Obtén tu sobra mensual y una sugerencia de gasto diario. Así siempre sabes cuánto puedes gastar hoy.',
      free100: '100% Gratis',
      free100Description: 'Sin costos ocultos. Sin suscripción. Sin trucos. Usa SOBRA sin límite de tiempo.',
      superFast: 'Diseñado para Perú',
      superFastDescription: 'Soles, Yape, Plin, bancos peruanos. SOBRA está hecho para cómo manejas tu dinero.',
      totalControl: 'Privado y seguro',
      totalControlDescription: 'Tus datos están cifrados y protegidos. Solo tú accedes a tu información financiera. Sin anuncios.',
      privacyTitle: 'Seguridad de nivel bancario',
      privacyDescription: 'Cifrado en reposo y en tránsito con Supabase + RLS. Nadie más puede ver tus datos.',
      screenshotTitle: 'Tu panel financiero',
      screenshotSubtitle: 'Todo en un vistazo: cuánto ganas, cuánto gastas y cuánto te sobra.',
      testimonialTitle: 'Personas que ya usan SOBRA',
      testimonialSubtitle: 'Historias reales de personas que tomaron el control de su dinero.',
      testimonial1Quote: '“Antes no sabía si podía comprar algo. Ahora abro SOBRA y sé exactamente cuánto me queda por día.”',
      testimonial1Name: 'Ana · Diseñadora freelance · Lima',
      testimonial2Quote: '“Me ayudó a organizar mis tarjetas y mi renta. Dejé de llegar justo a quincena.”',
      testimonial2Name: 'Luis · Ingeniero · Arequipa',
      testimonial3Quote: '“Empecé a ahorrar para mi fondo de emergencia sin sentir que me privaba de todo.”',
      testimonial3Name: 'María · Profesora · Cusco',
      exampleMonthly: 'Tu sobra del mes',
      exampleDaily: 'Puedes gastar hoy',
      faq: 'Preguntas Frecuentes',
      faqSubtitle: 'Todo lo que necesitas saber antes de empezar',
      faq1Question: '¿Es realmente gratis?',
      faq1Answer: 'Sí. SOBRA es 100% gratuito. No pedimos tarjeta de crédito ni limitamos funciones. El plan gratuito incluye todo lo que necesitas para gestionar tus finanzas.',
      faq2Question: '¿Cómo calcula cuánto me sobra?',
      faq2Answer: 'SOBRA suma todos tus ingresos y resta gastos fijos, gastos personales, deudas, compromisos y pagos de tarjeta. Lo que queda es tu sobra. La dividimos entre los días restantes del mes para darte una sugerencia de gasto diario.',
      faq3Question: '¿Mis datos están seguros?',
      faq3Answer: 'Absolutamente. Usamos Supabase con cifrado y Row Level Security. Tus datos financieros son 100% privados. No vendemos datos ni mostramos anuncios.',
      faq4Question: '¿Funciona en celular?',
      faq4Answer: 'Sí. SOBRA es una web app responsive que funciona perfectamente en celulares, tablets y computadoras. Accede desde cualquier dispositivo con internet.',
      ctaTitle: 'Empieza hoy. Es gratis.',
      ctaDescription: 'En 2 minutos configuras tu cuenta y ves cuánto te sobra este mes. Sin trucos, sin suscripción.',
      ctaButton: 'Crear mi cuenta gratis 🚀',
      pillarsTitle: 'Los 6 pilares de tu bienestar financiero',
      pillarsSubtitle: 'SOBRA no es solo una calculadora. Es un sistema completo — potenciado con inteligencia artificial — para construir tu tranquilidad financiera paso a paso.',
      pillar1Title: 'Calcula tu Sobra',
      pillar1Description: 'Ingresos - gastos - deudas - compromisos - tarjetas = lo que realmente te queda. Con sugerencia de gasto diario.',
      pillar2Title: 'Fondo de Emergencia',
      pillar2Description: 'Construye un colchón de 3 a 6 meses de gastos fijos. Te guiamos paso a paso con progreso visual.',
      pillar3Title: 'Simulador de Inversiones',
      pillar3Description: 'Calcula cuánto podrías acumular con interés compuesto. Explora productos del mercado peruano.',
      pillar4Title: 'Educación Financiera',
      pillar4Description: 'Tips personalizados según tu situación real. Aprende a ahorrar, invertir y salir de deudas.',
      pillar5Title: 'Conexiones Bancarias',
      pillar5Description: 'Conecta tus bancos peruanos (BCP, Interbank, BBVA, Scotiabank) para sincronizar automáticamente.',
      pillar6Title: 'Asistente Financiero con IA',
      pillar6Description: 'Un copiloto inteligente que analiza tus patrones de gasto, predice tu sobra futura y te da recomendaciones personalizadas para optimizar tus finanzas.',
      pillar6Badge: 'Próximamente',
      previewTitle: 'Así se ve tu dashboard',
      previewSubtitle: 'Toda tu vida financiera en una sola pantalla.',
      previewIncome: 'Ingresos',
      previewFixed: 'Gastos fijos',
      previewDebts: 'Deudas',
      previewSavings: 'Ahorro',
      previewPersonal: 'Gastos personales',
      previewCards: 'Tarjetas',
      previewSurplus: 'Tu sobra',
      previewDaily: 'Gasto diario sugerido',
      peruTitle: 'Hecho para Perú 🇵🇪',
      peruSubtitle: 'Compatible con los bancos y billeteras que usas todos los días.',
      peruBank1: 'BCP',
      peruBank2: 'Interbank',
      peruBank3: 'BBVA',
      peruBank4: 'Scotiabank',
      peruWallet1: 'Yape',
      peruWallet2: 'Plin',
      peruCurrency: 'Soles (PEN)',
    },
    onboarding: {
      welcome: '¡Bienvenido a SOBRA!',
      setupProfile: 'Configura tu perfil para comenzar',
      currency: 'Moneda',
      period: 'Periodo',
      initialIncome: 'Ingreso inicial (opcional)',
      initialIncomeLabel: 'Etiqueta del ingreso',
      optional: '(opcional)',
      getStarted: 'Comenzar',
      creating: 'Creando perfil...',
    },
    educationPage: {
      title: 'Educación financiera',
      subtitle: 'Consejos personalizados según tu situación financiera actual.',
      relevantCount: 'tips son relevantes para ti',
      activeTips: 'Tips activos para ti',
      ratedTips: 'Tips evaluados',
      dismissedTips: 'Tips descartados',
      allCategories: 'Todos',
      savings: 'Ahorro',
      debt: 'Deuda',
      investment: 'Inversión',
      emergency: 'Emergencia',
      spending: 'Gasto',
      general: 'General',
      showDismissed: 'Mostrar descartados',
      hideDismissed: 'Ocultar descartados',
      resetAll: 'Restaurar todos',
      noTips: 'No hay tips disponibles',
      noTipsCategory: 'No hay tips en esta categoría',
      tryOtherCategory: 'Intenta con otra categoría.',
      tryShowDismissed: 'Prueba mostrando los tips descartados.',
      useful: 'Útil',
      notUseful: 'No útil',
      isUseful: '¿Útil?',
      dismiss: 'Descartar',
      restore: 'Restaurar',
    },
    emergencyPage: {
      title: 'Fondo de emergencia',
      subtitle: 'Tu colchón financiero para imprevistos. Lo ideal es tener entre 3 y 6 meses de gastos fijos.',
      healthNone: 'Sin fondo de emergencia',
      healthCritical: 'Crítico — menos de 1 mes cubierto',
      healthBuilding: 'En construcción',
      healthHealthy: 'Saludable',
      healthStrong: '¡Excelente! Fondo completo',
      monthsCovered: 'meses cubiertos',
      saved: 'Tienes',
      ofSuggested: 'sugeridos',
      goal: 'Meta',
      monthlyFixed: 'Gastos fijos mensuales',
      suggestedRange: 'Rango sugerido',
      suggestedContribution: 'Aporte mensual sugerido',
      ofYourSurplus: '20% de tu sobra',
      monthsToComplete: 'Meses para completar',
      completed: '✅ Completado',
      months: 'meses',
      stepsTitle: 'Pasos para construir tu fondo',
      stepsSubtitle: 'Avanza paso a paso hasta cubrir 6 meses de gastos fijos',
      stepCreate: 'Crear meta de fondo de emergencia',
      stepCreateDesc: 'Crea una meta para empezar a ahorrar.',
      stepOneMonth: 'Cubrir 1 mes de gastos fijos',
      stepThreeMonths: 'Llegar a 3 meses (mínimo recomendado)',
      stepSixMonths: 'Llegar a 6 meses (ideal)',
      createFund: 'Crear fondo de emergencia',
      createFundDesc: 'Se creará una meta de ahorro tipo fondo de emergencia con el monto sugerido.',
      fundName: 'Fondo de emergencia',
      targetAmount: 'Monto objetivo',
      monthlyContribution: 'Aporte mensual',
      create: 'Crear fondo',
      creating: 'Creando...',
      addContribution: 'Registrar aporte',
      addContributionDesc: 'Actualiza el monto actual de tu fondo de emergencia.',
      currentAmount: 'Monto actual',
      addAmount: 'Monto a agregar',
      save: 'Guardar',
      saving: 'Guardando...',
      whereToKeep: '¿Dónde guardarlo?',
      whereToKeepDesc: 'Tu fondo de emergencia debe ser líquido y seguro.',
      whereItem1: 'Cuenta de ahorros con tasa preferencial',
      whereItem2: 'CTS (disponible en emergencia real)',
      whereItem3: 'Depósito a plazo corto (30-90 días)',
      whereNote: 'No uses fondos mutuos o acciones — son muy volátiles para emergencias.',
      whenToUse: '¿Cuándo usarlo?',
      whenToUseDesc: 'Un fondo de emergencia es solo para emergencias reales:',
      whenItem1: 'Pérdida de empleo',
      whenItem2: 'Gastos médicos inesperados',
      whenItem3: 'Reparación urgente del hogar o vehículo',
      debtWarning: '⚡ Primero paga deudas con alta tasa de interés, luego construye tu fondo.',
      noDebtMessage: '✅ No tienes deudas activas — puedes enfocarte 100% en tu fondo.',
      goToSavings: 'Ir a Metas de Ahorro',
    },
    investmentsPage: {
      title: 'Inversiones',
      subtitle: 'Haz que tu sobra trabaje para ti. Productos de inversión para el mercado peruano.',
      readyTitle: '¡Estás listo para invertir!',
      notReadyTitle: 'Checklist de preparación',
      readyDesc: 'requisitos. Tu sobra invertible este mes es',
      notReadyDesc: 'requisitos. Completa los pasos faltantes antes de invertir.',
      checkPositiveSurplus: 'Sobra positiva este mes',
      checkEmergencyStarted: 'Fondo de emergencia iniciado',
      checkOneMonth: 'Al menos 1 mes de emergencia cubierto',
      checkThreeMonths: 'Sobra positiva por 3+ meses',
      checkDebtsControlled: 'Deudas de alta tasa controladas',
      tipPositive: 'Necesitas tener más ingresos que gastos para poder invertir.',
      tipEmergency: 'Crea tu fondo de emergencia antes de invertir.',
      tipOneMonth: 'Cubre al menos 1 mes de gastos fijos en tu fondo de emergencia.',
      tipThreeMonths: 'mes(es) consecutivos con sobra positiva. Se recomienda al menos 3.',
      tipDebts: 'Prioriza pagar deudas con tasas mayores al 30% antes de invertir.',
      goToEmergency: 'Ir al fondo de emergencia',
      investableAmount: 'Monto invertible este mes',
      investableDesc: '50% de tu sobra neta',
      positiveMonths: 'Meses con sobra positiva',
      consecutive: 'consecutivos',
      availableProducts: 'Productos disponibles',
      referenceForPeru: 'referenciales para Perú',
      simulatorTitle: 'Simulador de interés compuesto',
      simulatorDesc: 'Calcula cuánto podrías acumular invirtiendo periódicamente',
      initialAmount: 'Monto inicial',
      monthlyContribution: 'Aporte mensual',
      annualRate: 'Tasa anual (%)',
      years: 'Años',
      useMyAmount: 'Usar mi monto invertible',
      totalAccumulated: 'Total acumulado',
      totalContributed: 'Total aportado',
      interestEarned: 'Ganancia por intereses',
      quarterlyEvolution: 'Evolución (trimestral)',
      riskLabel: 'Riesgo',
      liquidityLabel: 'Liquidez',
      annual: 'anual',
      minimum: 'Mínimo',
      simulate: 'Simular',
      disclaimerTitle: 'Disclaimer',
      disclaimerText: 'Esta información es referencial y educativa. No constituye asesoría financiera. Las tasas de retorno son estimaciones históricas y no garantizan rendimientos futuros. Consulta con un asesor financiero certificado antes de invertir.',
    },
    bankPage: {
      title: 'Conexiones Bancarias',
      subtitle: 'Conecta tus bancos peruanos para sincronizar transacciones automáticamente',
      poweredBy: 'Powered by Belvo',
      poweredByDesc: 'Usamos Belvo como proveedor de Open Banking para conectar con los principales bancos de Perú de forma segura. Tus credenciales bancarias nunca se almacenan en nuestros servidores.',
      encrypted: '🔒 Cifrado de extremo a extremo',
      regulated: '🏦 Regulado por SBS',
      availableBanks: 'Bancos disponibles',
      connected: 'Conectado',
      available: 'Disponible',
      connect: 'Conectar',
      comingSoon: 'Próximamente',
      comingSoonDesc: '💡 La conexión con Belvo estará disponible próximamente. Por ahora puedes registrar tus cuentas manualmente.',
      yourConnections: 'Tus conexiones',
      noConnections: 'Sin conexiones bancarias',
      noConnectionsDesc: 'Cuando conectes un banco, aparecerá aquí. Por ahora puedes gestionar tus cuentas manualmente.',
      goToAccounts: 'Ir a Cuentas',
      lastSync: 'Última sync',
      statusActive: 'Conectado',
      statusReauth: 'Requiere reautenticación',
      statusRevoked: 'Revocado',
      disconnect: 'Desconectar',
      disconnectConfirm: '¿Desconectar este banco?',
      docsTitle: 'Documentación de Belvo',
      docsDesc: 'Aprende más sobre cómo funciona Open Banking en Perú',
    },
    surplusSave: {
      title: 'Guardar snapshot del mes',
      description: 'para tu historial mensual.',
      updateNote: 'Si ya guardaste este mes, se actualizará.',
      saving: 'Guardando...',
      save: 'Guardar',
      goToCards: 'Ir a tarjetas',
      analyticsTitle: 'Análisis Visual de Finanzas',
      analyticsDesc: 'Explora gráficos interactivos y visualizaciones detalladas de tus ingresos y gastos',
      viewAnalytics: 'Ver Analytics',
      accounts: 'cuenta(s)',
      wallets: 'billetera(s)',
    },
  },
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
    },
    nav: {
      dashboard: 'Dashboard',
      incomes: 'Incomes',
      expenses: 'Expenses',
      commitments: 'Commitments',
      creditCards: 'Cards',
      accounts: 'Accounts',
      debts: 'Debts',
      savings: 'Savings Goals',
      bankConnections: 'Banks',
      emergencyFund: 'Emergency Fund',
      investments: 'Investments',
      education: 'Education',
      settings: 'Settings',
      logout: 'Logout',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your profile and preferences',
      profile: 'Profile',
      language: 'Language',
      languageDescription: 'Select the application language',
      preferences: 'Preferences',
      landingTitle: 'View marketing site',
      landingDescription: "Open SOBRA's public landing page to share or revisit it.",
      landingButton: 'Go to sobra.app',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your finances',
      leftover: 'What you have LEFT',
      afterPersonal: 'After personal expenses',
      dailySuggestion: 'Daily suggestion',
      perDay: '/ day',
      remainingDays: 'Remaining days',
      incomeTotal: 'Total Income',
      fixedExpenses: 'Fixed Expenses',
      commitments: 'Commitments',
      personalBudget: 'Personal Budget',
      cardDue: 'Card due (this month)',
      cardMinimumDue: 'Minimum due',
      cardNextDue: 'Next due date',
      cardOverdue: 'You have overdue card payments',
      cardDueSoon: 'Card payment due soon',
      calculation: 'Calculation',
      monthlyBreakdown: 'Monthly Breakdown',
      totalIncomes: 'Total incomes',
      fixedExpensesLabel: 'Fixed expenses',
      monthlyCommitments: 'Monthly commitments',
      leftoverBeforePersonal: 'Leftover before personal',
      personalBudgetLabel: 'Personal budget',
      percentageOfIncome: '% of income',
      noIncome: 'No income',
      scheduledSavings: 'Scheduled savings',
      variableExpenses: 'Variable expenses',
      sobraMensual: 'Your monthly SURPLUS',
      sobraSubtitle: 'What you really have left this month',
      grossSurplus: 'Gross surplus',
      netSurplus: 'Net surplus',
      surplusSafe: 'Safe surplus',
      surplusOperative: 'Operative surplus',
      surplusUnavailable: 'Reserve',
      consolidatedBalance: 'Consolidated balance',
      debtsLabel: 'Debts',
      savingsLabel: 'Committed savings',
      surplusTrend: 'Trend',
      surplusTrendSubtitle: 'Your monthly surplus evolution',
      accountsAndWallets: 'Accounts & wallets',
      noSurplusData: 'No surplus data yet',
      investable: 'Investable',
      operationalBuffer: 'Operational buffer',
      emergencyReserve: 'Emergency reserve',
    },
    incomes: {
      title: 'Incomes',
      subtitle: 'Manage your monthly income',
      manageIncome: 'Manage your income sources',
      addIncome: 'Add Income',
      newIncome: 'New Income',
      totalActive: 'Total Monthly Income',
      balance: 'Balance After Expenses',
      negativeBalance: '⚠️ You spend more than you earn',
      positiveBalance: '✅ Your budget is balanced',
      activeSources: 'active source(s)',
      negativeAlertTitle: '⚠️ Attention! Negative Budget',
      negativeAlertMessage:
        'Your total expenses ({totalExpenses}) exceed your income ({totalIncome}). Deficit: {deficit}. Consider reducing expenses or finding additional income.',
      totalExpenses: 'Total expenses',
      deficit: 'Deficit',
      suggestion: 'Consider reducing expenses or finding additional income to balance your budget.',
      noIncomes: 'No incomes',
      noIncomesDescription: 'Add your income sources to start managing your finances.',
    },
    expenses: {
      title: 'Expenses',
      subtitle: 'Manage your fixed expenses and personal budgets',
      fixed: 'Fixed Expenses',
      personal: 'Personal Budgets',
      addFixed: 'Add Fixed Expense',
      addPersonal: 'Add Personal Budget',
      newFixed: 'New Fixed Expense',
      newPersonal: 'New Personal Budget',
      noFixed: 'No fixed expenses',
      noFixedDescription: 'Add your recurring fixed expenses like rent, utilities, etc.',
      noPersonal: 'No personal budgets',
      noPersonalDescription: 'Add budgets for variable expenses like food, entertainment, etc.',
    },
    commitments: {
      title: 'Commitments',
      subtitle: 'Manage your monthly financial commitments',
      addCommitment: 'Add Commitment',
      newCommitment: 'New Commitment',
      total: 'Total Commitments',
      noCommitments: 'No commitments',
      noCommitmentsDescription: 'Add financial commitments like savings or scheduled payments.',
    },
    profile: {
      title: 'Profile',
      subtitle: 'Manage your personal information and preferences',
      personalInfo: 'Personal Information',
      currency: 'Currency',
      period: 'Period',
      monthly: 'Monthly',
      biweekly: 'Biweekly',
      currentPlan: 'Current Plan',
      plan: 'Plan',
      status: 'Status',
      active: 'Active',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      welcomeBack: 'Welcome back!',
      createAccount: 'Create your account to get started',
      loginToAccount: 'Login to your account',
      loggingIn: 'Logging in...',
      registering: 'Registering...',
      creatingAccount: 'Creating account...',
      accountCreated: 'Account created! Redirecting...',
      redirecting: 'Redirecting...',
      signUpError: 'Error signing up',
      loginError: 'Error logging in',
    },
    landing: {
      heroTitle: 'Your money, in order. Your life, at peace.',
      heroSubtitle: 'Personal finance for Peru',
      heroDescription:
        'SOBRA calculates how much you have left each month after income, expenses, debts, and commitments. It tells you exactly how much you can spend per day. That simple.',
      ctaStart: 'Start Free 🚀',
      ctaLogin: 'Login',
      free: 'Free forever',
      noCreditCard: 'No card required',
      quickSetup: 'Ready in 2 minutes',
      whyChoose: 'Why choose SOBRA?',
      whyChooseSubtitle: 'Everything you need to take control of your money, in one place',
      howItWorks: 'How it works?',
      howItWorksSubtitle: '4 steps. 2 minutes. Total control.',
      step1Title: '1. Record your income',
      step1Description: 'Salary, freelance, extras. It all adds up. SOBRA organizes them automatically by month.',
      step2Title: '2. Add your expenses',
      step2Description: 'Fixed expenses (rent, electricity, internet) and personal budgets (food, transport, leisure).',
      step3Title: '3. Define commitments and debts',
      step3Description: 'Credit cards, loans, installments. SOBRA deducts everything before calculating your surplus.',
      step4Title: '4. See how much you have LEFT',
      step4Description: 'Get your monthly surplus and a daily spending suggestion. So you always know how much you can spend today.',
      free100: '100% Free',
      free100Description: 'No hidden costs. No subscription. No tricks. Use SOBRA without time limits.',
      superFast: 'Built for Peru',
      superFastDescription: 'Soles, Yape, Plin, Peruvian banks. SOBRA is made for how you manage your money.',
      totalControl: 'Private and secure',
      totalControlDescription: 'Your data is encrypted and protected. Only you access your financial information. No ads.',
      privacyTitle: 'Bank-level security',
      privacyDescription: 'Encryption at rest and in transit with Supabase + RLS. No one else can see your data.',
      screenshotTitle: 'Your financial panel',
      screenshotSubtitle: 'Everything at a glance: how much you earn, how much you spend, and how much is left.',
      testimonialTitle: 'People already using SOBRA',
      testimonialSubtitle: 'Real stories from people who took control of their money.',
      testimonial1Quote: '“Before I never knew if I could buy something. Now I open SOBRA and know exactly how much I have left per day.”',
      testimonial1Name: 'Ana · Freelance designer · Lima',
      testimonial2Quote: '“It helped me organize my cards and rent. I stopped barely making it to payday.”',
      testimonial2Name: 'Luis · Engineer · Arequipa',
      exampleMonthly: 'Your monthly surplus',
      exampleDaily: 'You can spend today',
      faq: 'Frequently Asked Questions',
      faqSubtitle: 'Everything you need to know before getting started',
      faq1Question: 'Is it really free?',
      faq1Answer: "Yes. SOBRA is 100% free. We don't ask for a credit card or limit features. The free plan includes everything you need to manage your finances.",
      faq2Question: 'How does it calculate how much I have left?',
      faq2Answer: "SOBRA adds all your income and subtracts fixed expenses, personal expenses, debts, commitments, and card payments. What's left is your surplus. We divide it by the remaining days of the month to give you a daily spending suggestion.",
      faq3Question: 'Is my data secure?',
      faq3Answer: "Absolutely. We use Supabase with encryption and Row Level Security. Your financial data is 100% private. We don't sell data or show ads.",
      faq4Question: 'Does it work on mobile?',
      faq4Answer: 'Yes. SOBRA is a responsive web app that works perfectly on phones, tablets, and computers. Access from any device with internet.',
      ctaTitle: "Start today. It's free.",
      ctaDescription: 'In 2 minutes you set up your account and see how much you have left this month. No tricks, no subscription.',
      ctaButton: 'Create my free account 🚀',
      // 5 Pillars
      pillarsTitle: 'The 6 pillars of your financial wellbeing',
      pillarsSubtitle: "SOBRA is not just a calculator. It's a complete system — powered by artificial intelligence — to build your financial peace of mind step by step.",
      pillar1Title: 'Calculate your Surplus',
      pillar1Description: 'Income - expenses - debts - commitments - cards = what you really have left. With daily spending suggestion.',
      pillar2Title: 'Emergency Fund',
      pillar2Description: 'Build a cushion of 3 to 6 months of fixed expenses. We guide you step by step with visual progress.',
      pillar3Title: 'Investment Simulator',
      pillar3Description: 'Calculate how much you could accumulate with compound interest. Explore Peruvian market products.',
      pillar4Title: 'Financial Education',
      pillar4Description: 'Personalized tips based on your real situation. Learn to save, invest, and get out of debt.',
      pillar5Title: 'Bank Connections',
      pillar5Description: 'Connect your Peruvian banks (BCP, Interbank, BBVA, Scotiabank) to sync automatically.',
      pillar6Title: 'AI Financial Assistant',
      pillar6Description: 'A smart copilot that analyzes your spending patterns, predicts your future surplus, and gives you personalized recommendations to optimize your finances.',
      pillar6Badge: 'Coming Soon',
      // Dashboard preview
      previewTitle: 'This is what your dashboard looks like',
      previewSubtitle: 'Your entire financial life on a single screen.',
      previewIncome: 'Income',
      previewFixed: 'Fixed expenses',
      previewDebts: 'Debts',
      previewSavings: 'Savings',
      previewPersonal: 'Personal expenses',
      previewCards: 'Cards',
      previewSurplus: 'Your surplus',
      previewDaily: 'Suggested daily spend',
      // Peru focus
      peruTitle: 'Made for Peru 🇵🇪',
      peruSubtitle: 'Compatible with the banks and wallets you use every day.',
      peruBank1: 'BCP',
      peruBank2: 'Interbank',
      peruBank3: 'BBVA',
      peruBank4: 'Scotiabank',
      peruWallet1: 'Yape',
      peruWallet2: 'Plin',
      peruCurrency: 'Soles (PEN)',
      // Extra testimonial
      testimonial3Quote: '“The emergency fund gave me peace of mind. Now I have 3 months covered and still growing.”',
      testimonial3Name: 'Carmen · Teacher · Cusco',
    },
    onboarding: {
      welcome: 'Welcome to SOBRA!',
      setupProfile: 'Set up your profile to get started',
      currency: 'Currency',
      period: 'Period',
      initialIncome: 'Initial income (optional)',
      initialIncomeLabel: 'Income label',
      optional: '(optional)',
      getStarted: 'Get Started',
      creating: 'Creating profile...',
    },
    educationPage: {
      title: 'Financial Education',
      subtitle: 'Personalized tips based on your current financial situation.',
      relevantCount: 'tips are relevant to you',
      activeTips: 'Active tips for you',
      ratedTips: 'Rated tips',
      dismissedTips: 'Dismissed tips',
      allCategories: 'All',
      savings: 'Savings',
      debt: 'Debt',
      investment: 'Investment',
      emergency: 'Emergency',
      spending: 'Spending',
      general: 'General',
      showDismissed: 'Show dismissed',
      hideDismissed: 'Hide dismissed',
      resetAll: 'Restore all',
      noTips: 'No tips available',
      noTipsCategory: 'No tips in this category',
      tryOtherCategory: 'Try another category.',
      tryShowDismissed: 'Try showing dismissed tips.',
      useful: 'Useful',
      notUseful: 'Not useful',
      isUseful: 'Useful?',
      dismiss: 'Dismiss',
      restore: 'Restore',
    },
    emergencyPage: {
      title: 'Emergency Fund',
      subtitle: 'Your financial cushion for unexpected events. Ideally 3 to 6 months of fixed expenses.',
      healthNone: 'No emergency fund',
      healthCritical: 'Critical — less than 1 month covered',
      healthBuilding: 'Building up',
      healthHealthy: 'Healthy',
      healthStrong: 'Excellent! Fund complete',
      monthsCovered: 'months covered',
      saved: 'You have',
      ofSuggested: 'suggested',
      goal: 'Goal',
      monthlyFixed: 'Monthly fixed expenses',
      suggestedRange: 'Suggested range',
      suggestedContribution: 'Suggested monthly contribution',
      ofYourSurplus: '20% of your surplus',
      monthsToComplete: 'Months to complete',
      completed: '✅ Completed',
      months: 'months',
      stepsTitle: 'Steps to build your fund',
      stepsSubtitle: 'Step by step until you cover 6 months of fixed expenses',
      stepCreate: 'Create emergency fund goal',
      stepCreateDesc: 'Create a goal to start saving.',
      stepOneMonth: 'Cover 1 month of fixed expenses',
      stepThreeMonths: 'Reach 3 months (recommended minimum)',
      stepSixMonths: 'Reach 6 months (ideal)',
      createFund: 'Create emergency fund',
      createFundDesc: 'An emergency fund savings goal will be created with the suggested amount.',
      fundName: 'Emergency Fund',
      targetAmount: 'Target amount',
      monthlyContribution: 'Monthly contribution',
      create: 'Create fund',
      creating: 'Creating...',
      addContribution: 'Record contribution',
      addContributionDesc: 'Update the current amount of your emergency fund.',
      currentAmount: 'Current amount',
      addAmount: 'Amount to add',
      save: 'Save',
      saving: 'Saving...',
      whereToKeep: 'Where to keep it?',
      whereToKeepDesc: 'Your emergency fund should be liquid and safe.',
      whereItem1: 'Savings account with preferential rate',
      whereItem2: 'CTS (available in real emergencies)',
      whereItem3: 'Short-term deposit (30-90 days)',
      whereNote: "Don't use mutual funds or stocks — they're too volatile for emergencies.",
      whenToUse: 'When to use it?',
      whenToUseDesc: 'An emergency fund is only for real emergencies:',
      whenItem1: 'Job loss',
      whenItem2: 'Unexpected medical expenses',
      whenItem3: 'Urgent home or vehicle repair',
      debtWarning: '⚡ Pay off high-interest debts first, then build your fund.',
      noDebtMessage: '✅ No active debts — you can focus 100% on your fund.',
      goToSavings: 'Go to Savings Goals',
    },
    investmentsPage: {
      title: 'Investments',
      subtitle: 'Make your surplus work for you. Investment products for the Peruvian market.',
      readyTitle: 'You\'re ready to invest!',
      notReadyTitle: 'Readiness Checklist',
      readyDesc: 'requirements. Your investable surplus this month is',
      notReadyDesc: 'requirements. Complete the missing steps before investing.',
      checkPositiveSurplus: 'Positive surplus this month',
      checkEmergencyStarted: 'Emergency fund started',
      checkOneMonth: 'At least 1 month of emergency covered',
      checkThreeMonths: 'Positive surplus for 3+ months',
      checkDebtsControlled: 'High-interest debts controlled',
      tipPositive: 'You need more income than expenses to be able to invest.',
      tipEmergency: 'Create your emergency fund before investing.',
      tipOneMonth: 'Cover at least 1 month of fixed expenses in your emergency fund.',
      tipThreeMonths: 'consecutive month(s) with positive surplus. At least 3 recommended.',
      tipDebts: 'Prioritize paying off debts with rates above 30% before investing.',
      goToEmergency: 'Go to emergency fund',
      investableAmount: 'Investable amount this month',
      investableDesc: '50% of your net surplus',
      positiveMonths: 'Months with positive surplus',
      consecutive: 'consecutive',
      availableProducts: 'Available products',
      referenceForPeru: 'reference for Peru',
      simulatorTitle: 'Compound Interest Simulator',
      simulatorDesc: 'Calculate how much you could accumulate by investing periodically',
      initialAmount: 'Initial amount',
      monthlyContribution: 'Monthly contribution',
      annualRate: 'Annual rate (%)',
      years: 'Years',
      useMyAmount: 'Use my investable amount',
      totalAccumulated: 'Total accumulated',
      totalContributed: 'Total contributed',
      interestEarned: 'Interest earned',
      quarterlyEvolution: 'Evolution (quarterly)',
      riskLabel: 'Risk',
      liquidityLabel: 'Liquidity',
      annual: 'annual',
      minimum: 'Minimum',
      simulate: 'Simulate',
      disclaimerTitle: 'Disclaimer',
      disclaimerText: 'This information is for reference and educational purposes only. It does not constitute financial advice. Return rates are historical estimates and do not guarantee future performance. Consult a certified financial advisor before investing.',
    },
    bankPage: {
      title: 'Bank Connections',
      subtitle: 'Connect your Peruvian banks to sync transactions automatically',
      poweredBy: 'Powered by Belvo',
      poweredByDesc: 'We use Belvo as our Open Banking provider to securely connect with major Peruvian banks. Your banking credentials are never stored on our servers.',
      encrypted: '🔒 End-to-end encryption',
      regulated: '🏦 Regulated by SBS',
      availableBanks: 'Available banks',
      connected: 'Connected',
      available: 'Available',
      connect: 'Connect',
      comingSoon: 'Coming soon',
      comingSoonDesc: '💡 Belvo connection will be available soon. For now you can register your accounts manually.',
      yourConnections: 'Your connections',
      noConnections: 'No bank connections',
      noConnectionsDesc: 'When you connect a bank, it will appear here. For now you can manage your accounts manually.',
      goToAccounts: 'Go to Accounts',
      lastSync: 'Last sync',
      statusActive: 'Connected',
      statusReauth: 'Requires reauthentication',
      statusRevoked: 'Revoked',
      disconnect: 'Disconnect',
      disconnectConfirm: 'Disconnect this bank?',
      docsTitle: 'Belvo Documentation',
      docsDesc: 'Learn more about how Open Banking works in Peru',
    },
    surplusSave: {
      title: 'Save monthly snapshot',
      description: 'for your monthly history.',
      updateNote: 'If you already saved this month, it will be updated.',
      saving: 'Saving...',
      save: 'Save',
      goToCards: 'Go to cards',
      analyticsTitle: 'Visual Finance Analysis',
      analyticsDesc: 'Explore interactive charts and detailed visualizations of your income and expenses',
      viewAnalytics: 'View Analytics',
      accounts: 'account(s)',
      wallets: 'wallet(s)',
    },
  },
}
