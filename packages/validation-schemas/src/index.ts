export {
  createPropertySchema,
  propertyResponseSchema,
  propertyStatusSchema,
  propertyTypeSchema,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type CreatePropertyInput,
  type PropertyResponse,
  type PropertyStatus,
  type PropertyType,
} from './property/property.schema'

export {
  accessTokenResponseSchema,
  loginSchema,
  registerUserSchema,
  userResponseSchema,
  type AccessTokenResponse,
  type LoginInput,
  type RegisterUserInput,
  type UserResponse,
} from './auth/auth.schema'
