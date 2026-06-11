export const hasErrors = <T extends object>(errors: T): boolean => {
  return Object.keys(errors).length > 0;
};