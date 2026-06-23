import { ReactNode } from 'react';

type FormFieldProps = {
  children: ReactNode;
  fullWidth?: boolean;
  label: string;
};

export function FormField({ children, fullWidth = false, label }: FormFieldProps) {
  return (
    <label className={fullWidth ? 'full-width-field' : undefined}>
      {label}
      {children}
    </label>
  );
}
