import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type CommonProps = {
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

type LinkLikeProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string
  }

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined
  }

type AppButtonProps = LinkLikeProps | NativeButtonProps

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function getButtonClasses(tone: 'brand' | 'accent', fullWidth?: boolean, className?: string) {
  const toneClasses =
    tone === 'brand'
      ? 'bg-[var(--brand)] text-white shadow-[0_18px_38px_-22px_rgba(47,111,94,0.7)] hover:bg-[#295f51]'
      : 'bg-[var(--accent)] text-white shadow-[0_18px_38px_-22px_rgba(231,111,81,0.55)] hover:bg-[#d45f42]'

  return cx(
    'inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60',
    toneClasses,
    fullWidth && 'w-full',
    className,
  )
}

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')
}

function AppButton({
  children,
  className,
  fullWidth,
  href,
  tone,
  ...props
}: AppButtonProps & { tone: 'brand' | 'accent' }) {
  const classes = getButtonClasses(tone, fullWidth, className)

  if (href) {
    if (href.startsWith('#') || isExternalHref(href)) {
      const anchorProps = props as Omit<LinkLikeProps, keyof CommonProps | 'href'>
      return (
        <a className={classes} href={href} {...anchorProps}>
          {children}
        </a>
      )
    }

    const linkProps = props as Omit<LinkLikeProps, keyof CommonProps | 'href'>
    return (
      <Link className={classes} href={href} {...linkProps}>
        {children}
      </Link>
    )
  }

  const buttonProps = props as Omit<NativeButtonProps, keyof CommonProps>
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}

export function BrandButton(props: AppButtonProps) {
  return <AppButton tone="brand" {...props} />
}

export function AccentButton(props: AppButtonProps) {
  return <AppButton tone="accent" {...props} />
}

export default BrandButton
