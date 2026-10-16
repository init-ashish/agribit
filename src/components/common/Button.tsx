import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'accent' | 'outline' | 'whatsapp' | 'ghost'
type Size = 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  full?: boolean
  className?: string
  children?: ReactNode
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & { href?: undefined }
type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & { href: string }

const variants: Record<Variant, string> = {
  primary: 'bg-leaf-600 text-white hover:bg-leaf-700 shadow-md shadow-leaf-900/20',
  accent: 'bg-mustard-500 text-leaf-900 hover:bg-mustard-400 shadow-md shadow-mustard-600/30',
  outline: 'border-2 border-leaf-600 text-leaf-700 bg-white hover:bg-leaf-50',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1ebe5b] shadow-md shadow-green-900/20',
  ghost: 'text-leaf-700 hover:bg-leaf-100',
}
const sizes: Record<Size, string> = {
  md: 'min-h-12 px-5 text-base',
  lg: 'min-h-14 px-7 text-lg',
}

export default function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', full, className = '' } = props
  const cls = `inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _v, size: _s, full: _f, className: _c, ...anchor } = props
    return <a className={cls} {...anchor} />
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, full: _f, className: _c, ...button } = props
  return <button type="button" className={cls} {...button} />
}
