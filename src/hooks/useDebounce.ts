import { useEffect, useState } from "react";

/**
 * Devuelve el valor "retrasado" `delay` ms después del último cambio.
 * Útil para inputs de búsqueda: evita filtrar/pedir datos en cada tecla.
 *
 * const debouncedQuery = useDebounce(query, 300);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
