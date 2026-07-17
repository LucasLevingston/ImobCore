// Regra de negócio vive em @microfrontends/validation-schemas — compartilhada
// com o form schema de auth-frontend, pra não dessincronizar as duas validações.
export { type LoginInput, loginSchema } from '@microfrontends/validation-schemas'
