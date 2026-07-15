process.env.JWT_SECRET ??= 'test-secret-key-with-at-least-32-characters'
process.env.PROPERTIES_DATABASE_URL ??=
  'postgresql://postgres:postgres@localhost:5434/properties_db?schema=public'
