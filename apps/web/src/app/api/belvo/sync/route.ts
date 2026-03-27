/**
 * POST /api/belvo/sync
 *
 * Syncs transactions and balances for an existing bank connection.
 *
 * Body: { connection_id: string }
 * Returns: { synced: boolean, transactions_count: number }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { connection_id } = body

    if (!connection_id) {
      return NextResponse.json({ error: 'connection_id is required' }, { status: 400 })
    }

    // Verify the connection belongs to the user
    const { data: connection, error: connError } = await supabase
      .from('bank_connections')
      .select('id, external_link_id, user_id')
      .eq('id', connection_id)
      .eq('user_id', user.id)
      .single()

    if (connError || !connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 })
    }

    // TODO: When Belvo is configured, fetch and import transactions
    // const linkId = connection.access_token
    // const today = new Date().toISOString().split('T')[0]
    // const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
    // const transactions = await belvoApi.fetchTransactions(linkId, thirtyDaysAgo, today)
    // const balances = await belvoApi.fetchBalances(linkId)
    //
    // Import transactions as expenses/incomes...
    // Update account balances...

    // Update last_synced_at
    await supabase
      .from('bank_connections')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', connection_id)

    return NextResponse.json(
      { error: 'Sincronización bancaria no disponible aún' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error syncing bank:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Error al sincronizar banco' },
      { status: 500 }
    )
  }
}
