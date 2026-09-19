import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon-left">{icon}</span>}
        <input
          className={`input-field ${icon ? 'has-left-icon' : ''} ${error ? 'has-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};
