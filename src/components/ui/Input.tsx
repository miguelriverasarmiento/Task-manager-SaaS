import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const borderColor = error ? '#ef4444' : '#d1d5db'
    
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#374151' }} className="dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: borderColor,
            borderRadius: '0.5rem',
            outline: 'none',
          }}
          className={`
            shadow-sm transition-colors duration-200
            dark:bg-gray-800 dark:text-white
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            ${className}
          `}
          {...props}
        />
        {error && <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }} className="dark:text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
