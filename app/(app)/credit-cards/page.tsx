'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreditCards, useCreateCreditCard, useCardStatements, useCreateCardStatement, useCreateCardPayment, useCardDues, useCardSpending, useCreateCardTransaction } from '@/hooks/use-credit-cards'
import { useProfile } from '@/hooks/use-user'
import { calculateInstallmentPlan, formatCurrency } from '@/lib/finance/calc'
import { Separator } from '@/components/ui/separator'

export default function CreditCardsPage() {
  const { data: cards = [] } = useCreditCards()
  const { statements = [] } = useCardStatements()
  const {
    cardDueTotal,
    cardMinimumDue,
    nextDueDate,
    overdue,
  } = useCardDues()
  const {
    monthlySpend,
    installmentsDue,
    transactions: cardTransactions = [],
  } = useCardSpending()
  const { data: profile } = useProfile()
  const currency = (profile as any)?.currency || 'USD'
  const createCard = useCreateCreditCard()
  const createStatement = useCreateCardStatement()
  const createPayment = useCreateCardPayment()
  const createTransaction = useCreateCardTransaction()

  const [cardForm, setCardForm] = useState({
    name: '',
    issuer: '',
    credit_limit: '',
    cutoff_day: 1,
    due_day: 10,
  })

  const [statementForm, setStatementForm] = useState({
    card_id: '',
    statement_month: new Date().toISOString().slice(0, 7), // yyyy-mm
    closing_date: '',
    due_date: '',
    total_due: '',
    minimum_due: '',
  })

  const [paymentForm, setPaymentForm] = useState({
    card_id: '',
    statement_id: '',
    amount: '',
    paid_at: new Date().toISOString().slice(0, 10),
    method: '',
    note: '',
  })

  const [transactionForm, setTransactionForm] = useState({
    card_id: '',
    amount: '',
    description: '',
    category: '',
    purchased_at: new Date().toISOString().slice(0, 10),
    installments_total: 1,
  })

  const [simulator, setSimulator] = useState({
    amount: '1000',
    installments: '6',
    annualRate: '45',
    monthlyFee: '0',
  })

  const simulation = useMemo(() => {
    const amount = parseFloat(simulator.amount || '0')
    const installments = Math.max(Number(simulator.installments) || 0, 1)
    const annualRate = Math.max(parseFloat(simulator.annualRate || '0'), 0) / 100
    const monthlyFee = Math.max(parseFloat(simulator.monthlyFee || '0'), 0)

    return calculateInstallmentPlan({
      amount,
      installments,
      annualEffectiveRate: annualRate,
      monthlyFee,
    })
  }, [simulator])

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault()
    await createCard.mutateAsync({
      name: cardForm.name,
      issuer: cardForm.issuer || null,
      credit_limit: cardForm.credit_limit ? parseFloat(cardForm.credit_limit) : null,
      cutoff_day: Number(cardForm.cutoff_day),
      due_day: Number(cardForm.due_day),
      is_active: true,
    })
    setCardForm({ name: '', issuer: '', credit_limit: '', cutoff_day: 1, due_day: 10 })
  }

  const handleCreateStatement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!statementForm.card_id) return
    const month = statementForm.statement_month
      ? new Date(`${statementForm.statement_month}-01`).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
    await createStatement.mutateAsync({
      card_id: statementForm.card_id,
      statement_month: month,
      closing_date: statementForm.closing_date || month,
      due_date: statementForm.due_date || month,
      total_due: parseFloat(statementForm.total_due || '0'),
      minimum_due: statementForm.minimum_due ? parseFloat(statementForm.minimum_due) : 0,
      status: 'open',
    })
    setStatementForm({
      card_id: '',
      statement_month: new Date().toISOString().slice(0, 7),
      closing_date: '',
      due_date: '',
      total_due: '',
      minimum_due: '',
    })
  }

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentForm.card_id) return
    await createPayment.mutateAsync({
      card_id: paymentForm.card_id,
      statement_id: paymentForm.statement_id || null,
      amount: parseFloat(paymentForm.amount || '0'),
      paid_at: paymentForm.paid_at,
      method: paymentForm.method || null,
      note: paymentForm.note || null,
    })
    setPaymentForm({
      card_id: '',
      statement_id: '',
      amount: '',
      paid_at: new Date().toISOString().slice(0, 10),
      method: '',
      note: '',
    })
  }

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transactionForm.card_id || !transactionForm.amount) return

    await createTransaction.mutateAsync({
      card_id: transactionForm.card_id,
      amount: parseFloat(transactionForm.amount || '0'),
      description: transactionForm.description || null,
      category: transactionForm.category || null,
      purchased_at: transactionForm.purchased_at,
      installments_total: Number(transactionForm.installments_total) || 1,
    })

    setTransactionForm({
      card_id: '',
      amount: '',
      description: '',
      category: '',
      purchased_at: new Date().toISOString().slice(0, 10),
      installments_total: 1,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Tarjetas de crédito</h1>
        <p className="text-muted-foreground mt-1">
          Controla tus consumos y pagos de tarjeta para reflejarlos en el SOBRA mensual.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Pago del mes</CardTitle>
            <CardDescription>Total a restar del sobrante este mes</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {formatCurrency(cardDueTotal || 0, currency)}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Pago mínimo</CardTitle>
            <CardDescription>Requerido para evitar mora</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {formatCurrency(cardMinimumDue || 0, currency)}
          </CardContent>
        </Card>
        <Card className={`border ${overdue ? 'border-red-400/50 bg-red-500/10' : 'border-border/70 bg-card'}`}>
          <CardHeader>
            <CardTitle>Próximo vencimiento</CardTitle>
            <CardDescription>{overdue ? 'Pago atrasado' : 'Fecha límite del mes'}</CardDescription>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {nextDueDate ? new Date(nextDueDate).toLocaleDateString() : 'Sin vencimientos'}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Gasto del mes</CardTitle>
            <CardDescription>Suma de consumos registrados</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {formatCurrency(monthlySpend || 0, currency)}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Cuota de compras</CardTitle>
            <CardDescription>Cuotas que caen este mes</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {formatCurrency(installmentsDue || 0, currency)}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Agregar tarjeta</CardTitle>
            <CardDescription>Alias, banco y días de corte/pago</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreateCard}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={cardForm.name}
                    onChange={(e) => setCardForm((s) => ({ ...s, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Banco/Emisor</Label>
                  <Input
                    value={cardForm.issuer}
                    onChange={(e) => setCardForm((s) => ({ ...s, issuer: e.target.value }))}
                    placeholder="Opcional"
                  />
                </div>
                <div>
                  <Label>Límite</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={cardForm.credit_limit}
                    onChange={(e) => setCardForm((s) => ({ ...s, credit_limit: e.target.value }))}
                    placeholder="Opcional"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Día de corte</Label>
                    <Input
                      type="number"
                      min={1}
                      max={28}
                      value={cardForm.cutoff_day}
                      onChange={(e) => setCardForm((s) => ({ ...s, cutoff_day: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Día de pago</Label>
                    <Input
                      type="number"
                      min={1}
                      max={28}
                      value={cardForm.due_day}
                      onChange={(e) => setCardForm((s) => ({ ...s, due_day: Number(e.target.value) }))}
                      required
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createCard.isPending}>
                {createCard.isPending ? 'Guardando...' : 'Guardar tarjeta'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Registrar estado mensual</CardTitle>
            <CardDescription>Ingresa el monto total y mínimo del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreateStatement}>
              <div className="space-y-2">
                <Label>Tarjeta</Label>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={statementForm.card_id}
                  onChange={(e) => setStatementForm((s) => ({ ...s, card_id: e.target.value }))}
                  required
                >
                  <option value="">Selecciona tarjeta</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Mes</Label>
                  <Input
                    type="month"
                    value={statementForm.statement_month}
                    onChange={(e) => setStatementForm((s) => ({ ...s, statement_month: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Cierre</Label>
                  <Input
                    type="date"
                    value={statementForm.closing_date}
                    onChange={(e) => setStatementForm((s) => ({ ...s, closing_date: e.target.value }))}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Vencimiento</Label>
                  <Input
                    type="date"
                    value={statementForm.due_date}
                    onChange={(e) => setStatementForm((s) => ({ ...s, due_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Monto total</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={statementForm.total_due}
                    onChange={(e) => setStatementForm((s) => ({ ...s, total_due: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Mínimo a pagar</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={statementForm.minimum_due}
                  onChange={(e) => setStatementForm((s) => ({ ...s, minimum_due: e.target.value }))}
                  placeholder="Ej: 25.00"
                />
              </div>
              <Button type="submit" className="w-full" disabled={createStatement.isPending}>
                {createStatement.isPending ? 'Guardando...' : 'Guardar estado'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Registrar consumo</CardTitle>
            <CardDescription>Ingresa compras y cuotas</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreateTransaction}>
              <div className="space-y-2">
                <Label>Tarjeta</Label>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={transactionForm.card_id}
                  onChange={(e) => setTransactionForm((s) => ({ ...s, card_id: e.target.value }))}
                  required
                >
                  <option value="">Selecciona tarjeta</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm((s) => ({ ...s, amount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Cuotas</Label>
                  <Input
                    type="number"
                    min={1}
                    max={48}
                    value={transactionForm.installments_total}
                    onChange={(e) => setTransactionForm((s) => ({ ...s, installments_total: Number(e.target.value) || 1 }))}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Fecha de compra</Label>
                  <Input
                    type="date"
                    value={transactionForm.purchased_at}
                    onChange={(e) => setTransactionForm((s) => ({ ...s, purchased_at: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Input
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm((s) => ({ ...s, category: e.target.value }))}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div>
                <Label>Descripcion</Label>
                <Input
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm((s) => ({ ...s, description: e.target.value }))}
                  placeholder="Opcional"
                />
              </div>
              <Button type="submit" className="w-full" disabled={createTransaction.isPending}>
                {createTransaction.isPending ? 'Guardando...' : 'Guardar consumo'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Registrar pago</CardTitle>
          <CardDescription>Aplica un pago a la tarjeta o estado seleccionado</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end" onSubmit={handleCreatePayment}>
            <div className="space-y-2">
              <Label>Tarjeta</Label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={paymentForm.card_id}
                onChange={(e) => setPaymentForm((s) => ({ ...s, card_id: e.target.value }))}
                required
              >
                <option value="">Selecciona tarjeta</option>
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Estado (opcional)</Label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={paymentForm.statement_id}
                onChange={(e) => setPaymentForm((s) => ({ ...s, statement_id: e.target.value }))}
              >
                <option value="">Sin asignar</option>
                {statements.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.statement_month?.slice(0, 10)} - vence {new Date(st.due_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Monto</Label>
              <Input
                type="number"
                step="0.01"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm((s) => ({ ...s, amount: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de pago</Label>
              <Input
                type="date"
                value={paymentForm.paid_at}
                onChange={(e) => setPaymentForm((s) => ({ ...s, paid_at: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Método</Label>
              <Input
                value={paymentForm.method}
                onChange={(e) => setPaymentForm((s) => ({ ...s, method: e.target.value }))}
                placeholder="Ej: débito, efectivo"
              />
            </div>
            <Button type="submit" className="w-full" disabled={createPayment.isPending}>
              {createPayment.isPending ? 'Guardando...' : 'Registrar pago'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Consumos recientes</CardTitle>
            <CardDescription>Ultimas compras registradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {cardTransactions.length === 0 && (
              <p className="text-sm text-muted-foreground">Aun no registras consumos.</p>
            )}
            {cardTransactions.slice(0, 5).map((tx) => {
              const card = cards.find((c) => c.id === tx.card_id)
              const perInstallment = Number(tx.amount) / (tx.installments_total || 1)
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-card/80 p-3"
                >
                  <div>
                    <p className="font-semibold text-foreground">{tx.description || 'Consumo'}</p>
                    <p className="text-xs text-muted-foreground">
                      {card?.name || 'Tarjeta'} - {new Date(tx.purchased_at).toLocaleDateString()} -{' '}
                      {tx.installments_total || 1} cuotas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(Number(tx.amount), currency)}</p>
                    {(tx.installments_total || 1) > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(perInstallment, currency)} / mes
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Simular cuotas y TCEA</CardTitle>
            <CardDescription>Calcula pago mensual, TCEA y total</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Monto</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={simulator.amount}
                  onChange={(e) => setSimulator((s) => ({ ...s, amount: e.target.value }))}
                />
              </div>
              <div>
                <Label>Cuotas</Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={simulator.installments}
                  onChange={(e) => setSimulator((s) => ({ ...s, installments: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>TCEA / TEA (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={simulator.annualRate}
                  onChange={(e) => setSimulator((s) => ({ ...s, annualRate: e.target.value }))}
                />
              </div>
              <div>
                <Label>Cuota fija mensual</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={simulator.monthlyFee}
                  onChange={(e) => setSimulator((s) => ({ ...s, monthlyFee: e.target.value }))}
                  placeholder="Seguro, membresia"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-card/80 p-3">
                <p className="text-xs text-muted-foreground">Pago mensual estimado</p>
                <p className="text-xl font-semibold text-foreground">
                  {formatCurrency(simulation.monthlyPayment, currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Base sin fee: {formatCurrency(simulation.baseMonthlyPayment, currency)}
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-card/80 p-3">
                <p className="text-xs text-muted-foreground">TCEA efectiva</p>
                <p className="text-xl font-semibold text-foreground">
                  {(simulation.effectiveAnnualCost * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Incluye cuota fija y tasa indicada
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border/70 bg-card/80 p-3">
                <p className="text-xs text-muted-foreground">Total a pagar</p>
                <p className="font-semibold">{formatCurrency(simulation.totalPayment, currency)}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-card/80 p-3">
                <p className="text-xs text-muted-foreground">Intereses estimados</p>
                <p className="font-semibold">{formatCurrency(simulation.totalInterest, currency)}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-card/80 p-3">
                <p className="text-xs text-muted-foreground">Costo fijo</p>
                <p className="font-semibold">{formatCurrency(simulation.feeCost, currency)}</p>
              </div>
            </div>
            {simulation.isInterestFree && (
              <p className="text-xs text-emerald-500">
                Plan sin interes: cuotas planas sin recargos.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Referencial para decidir cuotas o validar si una tarjeta es sin interes.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Estados y vencimientos</CardTitle>
          <CardDescription>Control de lo que vence este mes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {statements.length === 0 && (
            <p className="text-sm text-muted-foreground">No hay estados cargados este mes.</p>
          )}
          {statements.map((st) => {
            const card = cards.find((c) => c.id === st.card_id)
            return (
              <div
                key={st.id}
                className="rounded-xl border border-border/70 bg-card/80 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-foreground">{card?.name || 'Tarjeta'}</p>
                  <p className="text-sm text-muted-foreground">
                    Vence {new Date(st.due_date).toLocaleDateString()} • Mes {new Date(st.statement_month).toLocaleDateString()}
                  </p>
                </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold">{formatCurrency(Number(st.total_due), currency)}</p>
                <p className="text-xs text-muted-foreground">Mínimo {formatCurrency(Number(st.minimum_due || 0), currency)}</p>
              </div>
            </div>
          )
          })}
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Tarjetas</CardTitle>
          <CardDescription>Listado y configuración básica</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cards.length === 0 && <p className="text-sm text-muted-foreground">Aún no registras tarjetas.</p>}
          {cards.map((card) => (
            <div key={card.id} className="rounded-xl border border-border/70 bg-card/80 p-4 space-y-2">
              <p className="text-lg font-semibold text-foreground">{card.name}</p>
              <p className="text-sm text-muted-foreground">{card.issuer || 'Sin emisor'}</p>
              <p className="text-sm text-muted-foreground">Corte día {card.cutoff_day} • Pago día {card.due_day}</p>
              {card.credit_limit && (
                <p className="text-sm text-muted-foreground">Límite {formatCurrency(Number(card.credit_limit), currency)}</p>
              )}
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${card.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/50 text-slate-200'}`}>
                {card.is_active ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
