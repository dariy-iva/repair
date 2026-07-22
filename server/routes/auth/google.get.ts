const ALLOWED_EMAILS = ['dashann1992@gmail.com', 'meloman100189@gmail.com']

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile']
  },
  async onSuccess(event, { user }) {
    if (!ALLOWED_EMAILS.includes(user.email as string)) {
      return sendRedirect(event, '/?authError=unauthorized')
    }

    await setUserSession(event, {
      user: {
        email: user.email as string,
        name: user.name as string,
        avatar: user.picture as string
      }
    })

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    const message = encodeURIComponent((error as Error)?.message || 'unknown')
    return sendRedirect(event, `/?authError=failed&errorDetail=${message}`)
  }
})
