-- Seed financial_tips with initial tips for SOBRA users (Peru-focused)
-- These are global tips, not per-user. Users interact via user_tips table.

INSERT INTO financial_tips (tip_key, category, title_es, body_es, title_en, body_en, priority, is_active)
VALUES
  -- Ahorro
  ('regla_50_30_20', 'ahorro',
   'La regla 50/30/20',
   'Destina 50% de tus ingresos a necesidades, 30% a deseos y 20% a ahorro e inversión. SOBRA te ayuda a calcular esto automáticamente.',
   'The 50/30/20 Rule',
   'Allocate 50% of income to needs, 30% to wants, and 20% to savings and investments. SOBRA calculates this for you automatically.',
   1, true),

  ('fondo_emergencia', 'emergencia',
   'Tu colchón financiero',
   'Construye un fondo de emergencia de 3 a 6 meses de gastos fijos. En Perú, puedes usar una cuenta de ahorro CTS o un depósito a plazo en soles.',
   'Your financial cushion',
   'Build an emergency fund covering 3-6 months of fixed expenses. In Peru, you can use a CTS savings account or a fixed-term deposit in soles.',
   2, true),

  ('paga_deudas_caras', 'deuda',
   'Elimina deudas caras primero',
   'Las tarjetas de crédito en Perú cobran entre 40-80% TEA. Paga primero las deudas con mayor tasa de interés (método avalancha) para ahorrar miles de soles.',
   'Eliminate expensive debts first',
   'Credit cards in Peru charge 40-80% APR. Pay off the highest interest rate debts first (avalanche method) to save thousands.',
   3, true),

  ('automatiza_ahorro', 'ahorro',
   'Automatiza tu ahorro',
   'Configura transferencias automáticas el día que recibes tu sueldo. Lo que no ves, no lo gastas. Yape y Plin permiten programar transferencias.',
   'Automate your savings',
   'Set up automatic transfers on payday. What you don''t see, you don''t spend. Yape and Plin allow scheduled transfers.',
   4, true),

  ('conoce_tea_tcea', 'deuda',
   'TEA vs TCEA: conoce la diferencia',
   'La TEA es la tasa de interés anual, pero la TCEA incluye comisiones, seguros y gastos. Siempre compara la TCEA entre bancos antes de tomar un préstamo.',
   'APR vs Total Cost: know the difference',
   'TEA is the annual interest rate, but TCEA includes fees, insurance and expenses. Always compare TCEA between banks before taking a loan.',
   5, true),

  ('inversiones_peru', 'inversion',
   'Empieza a invertir con poco',
   'En Perú puedes empezar a invertir desde S/100 en fondos mutuos (SURA, Credicorp Capital) o desde $1 en plataformas como Tyba. No necesitas ser experto.',
   'Start investing with little',
   'In Peru you can start investing from S/100 in mutual funds (SURA, Credicorp Capital) or from $1 on platforms like Tyba. No expertise needed.',
   6, true),

  ('gratificacion', 'ahorro',
   'Aprovecha tu gratificación',
   'En julio y diciembre recibes una gratificación completa. Destina al menos 50% a tu fondo de emergencia o pago de deudas. Es dinero extra, trátalo como tal.',
   'Make the most of your bonus',
   'In July and December you receive a full bonus. Allocate at least 50% to your emergency fund or debt payments. It''s extra money, treat it that way.',
   7, true),

  ('cts_inteligente', 'ahorro',
   'Usa tu CTS estratégicamente',
   'Tu CTS es tu colchón. Puedes disponer del 100% del excedente de 4 sueldos. Si ya tienes fondo de emergencia, puedes usar el excedente para invertir.',
   'Use your CTS strategically',
   'Your CTS is your safety net. You can access 100% above 4 salaries. If you already have an emergency fund, use the excess to invest.',
   8, true),

  ('tarjeta_uso_correcto', 'deuda',
   'Tarjeta de crédito ≠ extensión de sueldo',
   'Usa tu tarjeta solo para compras que puedas pagar al 100% en la fecha de corte. Las cuotas generan intereses altísimos. Paga siempre el total, nunca el mínimo.',
   'Credit card ≠ salary extension',
   'Use your card only for purchases you can pay 100% by the due date. Installments generate very high interest. Always pay in full, never the minimum.',
   9, true),

  ('dolares_soles', 'inversion',
   'Diversifica en soles y dólares',
   'Mantener parte de tus ahorros en dólares te protege contra la devaluación del sol. Un buen punto de partida es 70% soles, 30% dólares.',
   'Diversify in soles and dollars',
   'Keeping part of your savings in dollars protects against sol devaluation. A good starting point is 70% soles, 30% dollars.',
   10, true),

  ('revisa_recibos', 'general',
   'Revisa tus recibos de servicios',
   'Muchas personas pagan de más en agua, luz o internet. Compara planes de internet (Movistar, Claro, Entel) y revisa que no tengas servicios que no usas.',
   'Review your utility bills',
   'Many people overpay for water, electricity or internet. Compare internet plans and check for unused services.',
   11, true),

  ('meta_concreta', 'ahorro',
   'Ahorra con un objetivo concreto',
   'Ahorrar "por ahorrar" es difícil. Ponle nombre a tu meta: "Viaje a Cusco", "Laptop nueva", "Inicial de depa". SOBRA te permite crear metas con seguimiento.',
   'Save with a concrete goal',
   'Saving "just because" is hard. Name your goal: "Trip to Cusco", "New laptop", "Down payment". SOBRA lets you create tracked goals.',
   12, true)

ON CONFLICT (tip_key) DO NOTHING;
