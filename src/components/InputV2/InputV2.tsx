/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputHTMLAttributes, forwardRef, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputV2 = forwardRef<HTMLInputElement, InputNumberProps>(function InputNuberInner(
  {
    errorMessage,
    className,
    classNameInput = 'h-10 p-3 w-full outline-none border border-gray-300 rounded-sm focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 text-sm min-h-[1.25rem]',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      //Thực thi onChange callBack từ bên ngoài truyền vào props
      onChange && onChange(event)
      // cập nhật localValue state
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input
        className={classNameInput}
        onChange={handleChange}
        value={value || localValue}
        {...rest}
        ref={ref}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputV2
