import Link from 'next/link'
import OAuthButton from '@/components/auth/OAuthButton'
import PasswordSignupForm from '@/components/auth/PasswordSignupForm'

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Opprett en konto</h1>
        <p className="mb-6 text-sm text-gray-500">Bli med og begynn å bidra med steder</p>

        <PasswordSignupForm />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">eller</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <OAuthButton provider="google" />

        <p className="mt-5 text-center text-sm text-gray-500">
          Har du allerede en konto?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Logg inn
          </Link>
        </p>
      </div>
    </main>
  )
}
