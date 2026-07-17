'use strict'

const TEST_FILE_PATTERN = /\.test\.tsx?$/
// Next.js exige `middleware`+`config` no mesmo arquivo `middleware.ts` na raiz do
// app — não é escolha de design, é convenção de framework (o build só lê esse
// arquivo específico). Mesmo mecanismo de exceção que TEST_FILE_PATTERN.
const MIDDLEWARE_FILE_PATTERN = /(^|[\\/])middleware\.ts$/
function isExemptFile(filename) {
  return TEST_FILE_PATTERN.test(filename) || MIDDLEWARE_FILE_PATTERN.test(filename)
}

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

module.exports = {
  'one-function-per-file': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Cada arquivo deve exportar no máximo uma função (SRP)',
      },
      schema: [],
    },
    create(context) {
      if (isExemptFile(context.getFilename())) return {}

      const exportedFunctionNodes = []

      return {
        'Program:exit'(program) {
          for (const stmt of program.body) {
            if (stmt.type === 'ExportNamedDeclaration' && stmt.declaration) {
              if (isExportedFunction(stmt.declaration)) {
                exportedFunctionNodes.push(stmt.declaration)
              }
            }
            if (stmt.type === 'ExportDefaultDeclaration') {
              if (
                stmt.declaration.type === 'FunctionDeclaration' ||
                stmt.declaration.type === 'ArrowFunctionExpression' ||
                stmt.declaration.type === 'FunctionExpression'
              ) {
                exportedFunctionNodes.push(stmt.declaration)
              }
            }
          }

          if (exportedFunctionNodes.length > 1) {
            for (const node of exportedFunctionNodes.slice(1)) {
              context.report({
                node,
                message:
                  'Este arquivo já exporta outra função — cada arquivo deve exportar no máximo uma (SRP). Extraia pra um arquivo próprio.',
              })
            }
          }
        },
      }
    },
  },

  'no-mixed-exports': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Não misturar exports de function com exports de type/interface/const não relacionados no mesmo arquivo',
      },
      schema: [],
    },
    create(context) {
      if (isExemptFile(context.getFilename())) return {}

      return {
        'Program:exit'(program) {
          const zodNames = collectZodSchemaNames(program)
          const functionNodes = []
          const typeNodes = []
          const constNodes = []
          const zodInferTargets = []

          for (const stmt of program.body) {
            if (stmt.type !== 'ExportNamedDeclaration' || !stmt.declaration) continue
            const decl = stmt.declaration

            if (isExportedFunction(decl)) {
              functionNodes.push(decl)
              continue
            }
            if (decl.type === 'TSTypeAliasDeclaration' || decl.type === 'TSInterfaceDeclaration') {
              typeNodes.push(decl)
              const target = zodInferTarget(decl)
              if (target) zodInferTargets.push({ node: decl, target })
              continue
            }
            if (decl.type === 'VariableDeclaration') {
              constNodes.push(decl)
            }
          }

          // Exceção Zod: um `type` que é `z.infer<typeof schemaExportadoNoMesmoArquivo>`
          // não conta como "mistura" — é o tipo derivado do próprio schema, mesma entidade.
          const nonExemptTypeNodes = typeNodes.filter((typeNode) => {
            const match = zodInferTargets.find((t) => t.node === typeNode)
            return !(match && zodNames.has(match.target))
          })
          const nonExemptConstNodes = constNodes.filter((constNode) => {
            const names = declaredNames(constNode)
            const allNamesAreZodSchemas = names.every((n) => zodNames.has(n))
            return !allNamesAreZodSchemas
          })

          const categoriesPresent = [
            functionNodes.length > 0,
            nonExemptTypeNodes.length > 0,
            nonExemptConstNodes.length > 0,
          ].filter(Boolean).length

          if (categoriesPresent > 1) {
            const offenders = [...functionNodes, ...nonExemptTypeNodes, ...nonExemptConstNodes]
            for (const node of offenders) {
              context.report({
                node,
                message:
                  'Este arquivo mistura tipos de export diferentes (function/type/const não relacionados) — separe em arquivos próprios (exceto schema Zod + seu type derivado, que é permitido).',
              })
            }
          }
        },
      }
    },
  },
}
