/**
 * POST /api/belvo/connect
 *
 * Registers a bank connection after the user authenticates via the Belvo widget.
 * Saves the connection to the bank_connections table.
 *
 * Body: { link_id: string, institution: string, institution_name: string }
 * Returns: { connection: BankConnection }
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
    const { link_id, institution, institution_name } = body

    if (!link_id || !institution) {
      return NextResponse.json({ error: 'link_id and institution are required' }, { status: 400 })
    }

    // TODO: When Belvo is configured, verify the link and fetch initial data
    // const linkDetails = await belvoApi.registerLink(link_id)
    // const accounts = await belvoApi.fetchAccounts(link_id)

    // Save connection record
    const { data: connection, error } = await supabase
      .from('bank_connections')
      .insert({
        user_id: user.id,
        provider: 'belvo',
        institution_code: institution,
        institution_name: institution_name || institution,
        status: 'active',
        external_link_id: link_id, // In production, this would be encrypted
        last_synced_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ connection })
  } catch (error) {
    console.error('Error connecting bank:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Error al conectar banco' },
      { status: 500 }
    )
  }
}
