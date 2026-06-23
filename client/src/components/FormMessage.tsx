type FormMessageProps = {
  children: string;
  variant: 'error' | 'success';
};

export function FormMessage({ children, variant }: FormMessageProps) {
  return (
    <p className={`form-message ${variant}-message`}>
      {children}
    </p>
  );
}
