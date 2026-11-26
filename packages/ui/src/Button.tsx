import type { ComponentProps } from 'react'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonClassName'

export type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, size, className)} {...rest} />
}
