import React, { FC } from 'react';
import { ErrorBoundary, ErrorBoundaryProps, FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}

const CustomErrorBoundary: FC<Omit<ErrorBoundaryProps, 'FallbackComponent'>> = ({ children, ...props }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} {...props}>
      {children}
    </ErrorBoundary>
  );
};

export default CustomErrorBoundary;
