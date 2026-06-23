import { HTMLAttributes, ReactNode } from 'react';

type PanelProps = HTMLAttributes<HTMLElement> & {
  as?: 'aside' | 'section' | 'div' | 'article';
  children: ReactNode;
};

export function Panel({
  as = 'aside',
  children,
  className = '',
  ...props
}: PanelProps) {
  if (as === 'section') {
    return (
      <section className={className} {...props}>
        {children}
      </section>
    );
  }

  if (as === 'div') {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  if (as === 'article') {
    return (
      <article className={className} {...props}>
        {children}
      </article>
    );
  }

  return (
    <aside className={className} {...props}>
      {children}
    </aside>
  );
}
