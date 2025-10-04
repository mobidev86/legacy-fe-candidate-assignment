import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerAction,
  footer,
  noPadding = false,
}) => {
  const paddingClass = noPadding ? '' : 'p-6';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex justify-between items-center border-b border-gray-100 p-6">
          <div>
            {title && <h3 className="text-lg font-semibold text-dark-800">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div className={paddingClass}>{children}</div>
      
      {footer && (
        <div className="border-t border-gray-100 p-6">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
