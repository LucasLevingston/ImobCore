// Regras de negócio (enums, limites, mensagens) vivem em @microfrontends/
// validation-schemas — compartilhadas com o form schema de properties-frontend,
// pra não dessincronizar as duas validações da mesma entidade.
export {
  createPropertySchema,
  propertyStatusSchema,
  propertyTypeSchema,
  type CreatePropertyInput,
} from '@microfrontends/validation-schemas'
