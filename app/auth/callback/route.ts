import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()

        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('OAuth callback error:', error)
            // Redirect to login with error
            return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Check if user has completed onboarding (has a profile)
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()

            // If no profile exists, redirect to onboarding
            if (!profile) {
                return NextResponse.redirect(`${origin}/onboarding`)
            }

            // If profile exists, redirect to dashboard
            return NextResponse.redirect(`${origin}/dashboard`)
        }
    }

    // Default redirect to login if something went wrong
    return NextResponse.redirect(`${origin}/login`)
}
