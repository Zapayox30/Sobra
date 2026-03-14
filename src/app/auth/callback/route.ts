import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    // Use configured site URL to prevent open-redirect attacks
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code || typeof code !== 'string') {
        return NextResponse.redirect(`${origin}/login?error=missing_code`)
    }

    try {
        const supabase = await createClient()

        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('OAuth callback error:', error.message)
            return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Check if user has completed onboarding (has a profile)
            const { data: profile } = await supabase
                .from('profiles')
                .select('user_id')
                .eq('user_id', user.id)
                .maybeSingle()

            // If no profile exists, redirect to onboarding
            if (!profile) {
                return NextResponse.redirect(`${origin}/onboarding`)
            }

            // If profile exists, redirect to dashboard
            return NextResponse.redirect(`${origin}/dashboard`)
        }

        return NextResponse.redirect(`${origin}/login`)
    } catch (err) {
        console.error('Auth callback unexpected error:', err)
        return NextResponse.redirect(`${origin}/login?error=unexpected`)
    }
}
