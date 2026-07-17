function isExportedFunction(node) {
  if (node.type === 'FunctionDeclaration') return true
  if (node.type === 'VariableDeclaration') {
    return node.declarations.some(
      (decl) =>
        decl.init &&
        (decl.init.type === 'ArrowFunctionExpression' || decl.init.type === 'FunctionExpression'),
    )
  }
  return false
}

// Nomes declarados por uma VariableDeclaration exportada (ex: `export const x = ..., y = ...`)
function declaredNames(node) {
  if (node.type !== 'VariableDeclaration') return []
  return node.declarations.filter((d) => d.id.type === 'Identifier').map((d) => d.id.name)
}

// `type X = z.infer<typeof schemaName>` -> 'schemaName', senão null
function zodInferTarget(node) {
  if (node.type !== 'TSTypeAliasDeclaration') return null
  const ann = node.typeAnnotation
  if (
    ann?.type === 'TSTypeReference' &&
    ann.typeName?.type === 'Identifier' &&
    ann.typeName.name === 'z' // não deveria acontecer via typeName direto, guarda de qualquer forma
  ) {
    return null
  }
  if (ann?.type !== 'TSTypeReference') return null
  const qualifier = ann.typeName
  const isZInfer =
    qualifier?.type === 'TSQualifiedName' &&
    qualifier.left?.name === 'z' &&
    qualifier.right?.name === 'infer'
  if (!isZInfer) return null
  const arg = ann.typeArguments?.params?.[0] ?? ann.typeParameters?.params?.[0]
  if (arg?.type !== 'TSTypeQuery') return null
  return arg.exprName?.name ?? null
}

// Identifier na base de uma cadeia de chamadas encadeadas — ex: em
// `createPropertySchema.extend({...})`, a base é `createPropertySchema`;
// em `z.object({...})`, a base é `z`.
function chainBaseIdentifier(expr) {
  while (expr?.type === 'CallExpression' && expr.callee?.type === 'MemberExpression') {
    expr = expr.callee.object
  }
  return expr?.type === 'Identifier' ? expr.name : null
}

// Um `const` exportado é "schema Zod" se seu inicializador encadeia a partir
// de `z.` (z.object({...})) OU a partir de outro schema Zod já conhecido no
// mesmo arquivo (createPropertySchema.extend({...}), builder pattern) — por
// isso o cálculo em `collectZodSchemaNames` é iterativo até estabilizar.
function collectZodSchemaNames(program) {
  const known = new Set(['z'])
  let changed = true
  while (changed) {
    changed = false
    for (const stmt of program.body) {
      if (
        stmt.type !== 'ExportNamedDeclaration' ||
        stmt.declaration?.type !== 'VariableDeclaration'
      )
        continue
      for (const decl of stmt.declaration.declarations) {
        if (decl.id.type !== 'Identifier' || known.has(decl.id.name)) continue
        const base = chainBaseIdentifier(decl.init)
        if (base && known.has(base)) {
          known.add(decl.id.name)
          changed = true
        }
      }
    }
  }
  known.delete('z')
  return known
}

module.exports = { isExportedFunction, declaredNames, zodInferTarget, collectZodSchemaNames }
