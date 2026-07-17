const { isExemptFile } = require('./is-exempt-file')
const {
  isExportedFunction,
  declaredNames,
  zodInferTarget,
  collectZodSchemaNames,
} = require('./ast-helpers')

module.exports = {
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
          return !names.every((n) => zodNames.has(n))
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
}
