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
      heroTitle: 'Descubre cuánto te sobra después de tus gastos mensuales',
      heroSubtitle:
        'Calcula tu dinero disponible con nuestra calculadora de finanzas personales. Toma control de tu presupuesto en minutos.',
      heroDescription:
        'Gestiona tus ingresos, gastos fijos y compromisos financieros. Descubre cuánto puedes gastar diariamente sin preocupaciones.',
      ctaStart: 'Comenzar Gratis 🚀',
      ctaLogin: 'Iniciar Sesión',
      free: 'Gratis para siempre',
      noCreditCard: 'Sin tarjeta de crédito',
      quickSetup: 'Listo en 2 minutos',
      whyChoose: '¿Por qué elegir SOBRA?',
      whyChooseSubtitle: 'La herramienta más simple para gestionar tus finanzas personales',
      howItWorks: '¿Cómo funciona?',
      howItWorksSubtitle: '4 simples pasos para tomar control de tus finanzas personales',
      step1Title: 'Agrega tus ingresos',
      step1Description: 'Registra tu sueldo mensual y cualquier ingreso extra. Calcula el total de tus ingresos fácilmente.',
      step2Title: 'Registra tus gastos',
      step2Description: 'Añade tus gastos fijos recurrentes (alquiler, servicios) y presupuestos personales categorizados.',
      step3Title: 'Define compromisos',
      step3Description: 'Establece metas de ahorro o pagos programados con fechas específicas. Planifica tus compromisos financieros.',
      step4Title: 'Ve cuánto te SOBRA',
      step4Description:
        'Descubre tu dinero disponible mensual y recibe una sugerencia de gasto diario para mantenerte dentro del presupuesto.',
      free100: '100% Gratis',
      free100Description: 'Sin costos ocultos, sin tarjeta de crédito requerida. Gestiona tus finanzas sin límites de tiempo.',
      superFast: 'Súper Rápido',
      superFastDescription:
        'Configura tu cuenta en menos de 2 minutos. Interfaz intuitiva para calcular tu presupuesto al instante.',
      totalControl: 'Control Total',
      totalControlDescription: 'Visualiza todos tus ingresos, gastos y compromisos en un solo lugar. Toma decisiones informadas.',
      privacyTitle: 'Privacidad y seguridad',
      privacyDescription: 'Tus datos están protegidos en Supabase con RLS. Solo tú puedes ver y gestionar tu información financiera.',
      screenshotTitle: 'Así se ve tu dashboard',
      screenshotSubtitle: 'Un vistazo rápido al cálculo de tu sobrante y sugerencia diaria.',
      testimonialTitle: 'Personas que ya usan SOBRA',
      testimonialSubtitle: 'Historias breves de usuarios reales.',
      testimonial1Quote: '“En 5 minutos vi cuánto podía gastar cada día sin salirme del presupuesto.”',
      testimonial1Name: 'Ana · Freelance',
      testimonial2Quote: '“Me ayudó a ordenar tarjetas y renta; dejé de vivir al límite cada quincena.”',
      testimonial2Name: 'Luis · Ingeniero',
      exampleMonthly: 'Ejemplo de cálculo del mes',
      exampleDaily: 'Ejemplo de sugerencia diaria',
      faq: 'Preguntas Frecuentes',
      faqSubtitle: 'Todo lo que necesitas saber sobre SOBRA',
      faq1Question: '¿Es realmente gratis?',
      faq1Answer:
        'Sí, SOBRA es 100% gratuito y siempre lo será. No requerimos tarjeta de crédito ni tienes límites de tiempo para usar la aplicación.',
      faq2Question: '¿Cómo calcula cuánto me sobra?',
      faq2Answer:
        'SOBRA toma tus ingresos totales, resta tus gastos fijos, gastos personales y compromisos mensuales. El resultado es tu dinero disponible, que dividimos entre los días del mes para darte una sugerencia de gasto diario.',
      faq3Question: '¿Mis datos están seguros?',
      faq3Answer:
        'Absolutamente. Usamos Supabase con encriptación de extremo a extremo. Tus datos financieros son privados y solo tú puedes acceder a ellos. No compartimos tu información con terceros.',
      faq4Question: '¿Puedo usar SOBRA desde mi móvil?',
      faq4Answer:
        'Sí, SOBRA es una aplicación web responsive que funciona perfectamente en móviles, tablets y ordenadores. Accede desde cualquier dispositivo con conexión a internet.',
      ctaTitle: 'Comienza a gestionar tus finanzas hoy',
      ctaDescription:
        'Es gratis, simple y te tomará menos de 2 minutos configurar tu cuenta. Sin trucos, sin tarjeta de crédito requerida. Toma control de tu dinero ahora mismo.',
      ctaButton: 'Crear cuenta gratis 🚀',
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
      heroTitle: 'Discover how much you have left after your monthly expenses',
      heroSubtitle:
        'Calculate your available money with our personal finance calculator. Take control of your budget in minutes.',
      heroDescription:
        'Manage your income, fixed expenses, and financial commitments. Discover how much you can spend daily without worries.',
      ctaStart: 'Start Free 🚀',
      ctaLogin: 'Login',
      free: 'Free forever',
      noCreditCard: 'No credit card',
      quickSetup: 'Setup in 2 minutes',
      whyChoose: 'Why choose SOBRA?',
      whyChooseSubtitle: 'The simplest tool to manage your personal finances',
      howItWorks: 'How it works?',
      howItWorksSubtitle: '4 simple steps to take control of your personal finances',
      step1Title: 'Add your income',
      step1Description: 'Record your monthly salary and any extra income. Easily calculate your total income.',
      step2Title: 'Record your expenses',
      step2Description: 'Add your recurring fixed expenses (rent, utilities) and categorized personal budgets.',
      step3Title: 'Define commitments',
      step3Description: 'Set savings goals or scheduled payments with specific dates. Plan your financial commitments.',
      step4Title: 'See how much you have LEFT',
      step4Description:
        'Discover your available monthly money and receive a daily spending suggestion to stay within budget.',
      free100: '100% Free',
      free100Description: 'No hidden costs, no credit card required. Manage your finances without time limits.',
      superFast: 'Super Fast',
      superFastDescription:
        'Set up your account in less than 2 minutes. Intuitive interface to calculate your budget instantly.',
      totalControl: 'Total Control',
      totalControlDescription: 'View all your income, expenses, and commitments in one place. Make informed decisions.',
      privacyTitle: 'Privacy and security',
      privacyDescription: 'Your data is protected in Supabase with RLS. Only you can view and manage your financial info.',
      screenshotTitle: 'This is your dashboard',
      screenshotSubtitle: 'A quick look at your leftover and daily suggestion.',
      testimonialTitle: 'People using SOBRA',
      testimonialSubtitle: 'Short stories from real users.',
      testimonial1Quote: '"In 5 minutes I saw how much I could spend each day without breaking my budget."',
      testimonial1Name: 'Ana · Freelancer',
      testimonial2Quote: '"Helped me organize cards and rent; I stopped living paycheck to paycheck."',
      testimonial2Name: 'Luis · Engineer',
      exampleMonthly: 'Monthly example',
      exampleDaily: 'Daily suggestion example',
      faq: 'Frequently Asked Questions',
      faqSubtitle: 'Everything you need to know about SOBRA',
      faq1Question: 'Is it really free?',
      faq1Answer:
        'Yes, SOBRA is 100% free and always will be. We do not require a credit card and you have no time limits to use the application.',
      faq2Question: 'How does it calculate how much I have left?',
      faq2Answer:
        'SOBRA takes your total income, subtracts your fixed expenses, personal expenses, and monthly commitments. The result is your available money, which we divide by the days of the month to give you a daily spending suggestion.',
      faq3Question: 'Is my data secure?',
      faq3Answer:
        'Absolutely. We use Supabase with end-to-end encryption. Your financial data is private and only you can access it. We do not share your information with third parties.',
      faq4Question: 'Can I use SOBRA from my phone?',
      faq4Answer:
        'Yes, SOBRA is a responsive web application that works perfectly on mobile phones, tablets, and computers. Access from any device with an internet connection.',
      ctaTitle: 'Start managing your finances today',
      ctaDescription:
        "It's free, simple, and will take you less than 2 minutes to set up your account. No tricks, no credit card required. Take control of your money right now.",
      ctaButton: 'Create Free Account 🚀',
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
  },
}
