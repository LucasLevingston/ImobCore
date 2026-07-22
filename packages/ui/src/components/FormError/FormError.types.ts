export interface FormErrorProps {
  // `| undefined` explícito (não só `?`) — exactOptionalPropertyTypes exige
  // isso pra aceitar `message={error?.message}`, que é `string | undefined`
  message?: string | undefined
  className?: string
}
