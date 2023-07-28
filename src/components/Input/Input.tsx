/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputHTMLAttributes } from 'react'
import type { UseFormRegister, RegisterOptions } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  classNameInput?: string
  classNameError?: string
}

export default function Input({
  errorMessage,
  className,
  name,
  register,
  rules,
  classNameInput = 'h-10 p-3 w-full outline-none border border-gray-300 rounded-sm focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 text-red-600 text-sm min-h-[1.25rem]',
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : null
  return (
    <div className={className}>
      <input className={classNameInput} {...registerResult} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
