import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-[var(--panel-border)] bg-white dark:bg-gray-800 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
