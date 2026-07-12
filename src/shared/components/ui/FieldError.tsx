export const FieldError = ({ message }: { message?: string }) =>
  message ? <span className="text-xs text-red-600">{message}</span> : null;
