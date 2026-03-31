import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Sett nytt passord</h1>
        <p className="mb-6 text-sm text-gray-500">Velg et nytt passord for kontoen din.</p>

        <ResetPasswordForm />
      </div>
    </main>
  )
}
