process.env.JWT_SECRET ??= 'test-secret-key-with-at-least-32-characters'
process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ??= '15m'
process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ??= '7d'
process.env.BCRYPT_SALT_ROUNDS ??= '4'
