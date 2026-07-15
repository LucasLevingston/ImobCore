import { authHandlers } from './auth'
import { propertiesHandlers } from './properties'

export const handlers = [...authHandlers, ...propertiesHandlers]
