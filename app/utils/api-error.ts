/**
 * Extrae el mensaje de error de una respuesta del backend.
 *
 * Acepta tanto el `FetchError` que lanza `$fetch` (con el cuerpo en `.data`)
 * como el cuerpo de la respuesta directo (`response._data`). El backend
 * responde `{ error, message, status }`.
 */
export function extractApiError(err: unknown, fallback = 'Ocurrió un error inesperado'): string {
  const data = (err as { data?: unknown })?.data ?? err
  const message = (data as { message?: unknown })?.message

  if (typeof message === 'string' && message.trim()) return message
  if (err instanceof Error && err.message) return err.message
  return fallback
}
