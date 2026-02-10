'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseFormFieldProps {
    label: string;
    error?: string;
    helpText?: string;
    required?: boolean;
    className?: string;
}

type InputProps = BaseFormFieldProps & InputHTMLAttributes<HTMLInputElement> & {
    as?: 'input';
};

type TextareaProps = BaseFormFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: 'textarea';
};

type FormFieldProps = InputProps | TextareaProps;

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
    ({ label, error, helpText, required, className = '', as = 'input', ...props }, ref) => {
        const id = props.id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
        const hasError = !!error;

        const baseInputClasses = `apple-input ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''}`;

        const InputElement = as === 'textarea' ? 'textarea' : 'input';

        return (
            <div className={className}>
                <label htmlFor={id} className="apple-label">
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1" aria-label="required">
                            *
                        </span>
                    )}
                </label>

                <InputElement
                    ref={ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
                    id={id}
                    className={baseInputClasses}
                    aria-invalid={hasError}
                    aria-describedby={
                        error ? `${id}-error` : helpText ? `${id}-help` : undefined
                    }
                    required={required}
                    {...(props as InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />

                {error && (
                    <p
                        id={`${id}-error`}
                        className="mt-1.5 text-[13px] text-red-600 flex items-center gap-1.5"
                        role="alert"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </p>
                )}

                {!error && helpText && (
                    <p
                        id={`${id}-help`}
                        className="mt-1.5 text-[13px] text-apple-gray-300"
                    >
                        {helpText}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = 'FormField';

export default FormField;

interface SelectFieldProps extends BaseFormFieldProps {
    children: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    name?: string;
}

export function SelectField({
    label,
    error,
    helpText,
    required,
    className = '',
    children,
    ...props
}: SelectFieldProps) {
    const id = props.name || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const hasError = !!error;

    return (
        <div className={className}>
            <label htmlFor={id} className="apple-label">
                {label}
                {required && (
                    <span className="text-red-500 ml-1" aria-label="required">
                        *
                    </span>
                )}
            </label>

            <select
                id={id}
                className={`apple-input ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                aria-invalid={hasError}
                aria-describedby={
                    error ? `${id}-error` : helpText ? `${id}-help` : undefined
                }
                required={required}
                {...props}
            >
                {children}
            </select>

            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-1.5 text-[13px] text-red-600 flex items-center gap-1.5"
                    role="alert"
                >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}

            {!error && helpText && (
                <p
                    id={`${id}-help`}
                    className="mt-1.5 text-[13px] text-apple-gray-300"
                >
                    {helpText}
                </p>
            )}
        </div>
    );
}
