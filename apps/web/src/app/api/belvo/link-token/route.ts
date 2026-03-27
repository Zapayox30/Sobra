/**
 * POST /api/belvo/link-token
 *
 * Creates a Belvo widget access token for the frontend.
 * The frontend uses this token to open the Belvo Link widget.
 *
 * Body: { institution: string }
 * Returns: { access_token: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { institution } = body

    if (!institution) {
      return NextResponse.json({ error: 'institution is required' }, { status: 400 })
    }

    // TODO: Implement when Belvo credentials are configured
    // import { getBelvoConfig } from '@/lib/belvo'
    // const config = getBelvoConfig()
    // const token = await belvoApi.createLinkToken(institution)
    // return NextResponse.json(token)

    return NextResponse.json(
      { error: 'Integración bancaria no configurada' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error creating link token:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Error al crear token de enlace' },
      { status: 500 }
    )
  }
}
