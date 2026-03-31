import Link from 'next/link'
import OAuthButton from '@/components/auth/OAuthButton'
import MagicLinkForm from '@/components/auth/MagicLinkForm'
import PasswordLoginForm from '@/components/auth/PasswordLoginForm'
import LoginTabs from '@/components/auth/LoginTabs'

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Logg inn</h1>
        <p className="mb-6 text-sm text-gray-500">Velkommen tilbake til KidSpots Bergen</p>

        <LoginTabs
          magicLink={<MagicLinkForm />}
          password={<PasswordLoginForm />}
        />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">eller</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3">
          <OAuthButton provider="google" />
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Ingen konto?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Registrer deg
          </Link>
        </p>
      </div>
    </main>
  )
}
