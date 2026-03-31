import Link from 'next/link'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Tilbakestill passord</h1>
        <p className="mb-6 text-sm text-gray-500">
          Skriv inn e-posten din, så sender vi deg en tilbakestillingslenke.
        </p>

        <ForgotPasswordForm />

        <p className="mt-5 text-center text-sm text-gray-500">
          Husket det?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Logg inn
          </Link>
        </p>
      </div>
    </main>
  )
}
