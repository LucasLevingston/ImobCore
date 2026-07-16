# @microfrontends/module-federation-utils

Helper de build pra config do Module Federation — evita reescrever `requiredVersion` manualmente em `next.config.js` toda vez que `react`/`react-dom` são bumpados no `package.json` do app.

## O que resolve (e o que não resolve)

Só automatiza a parte tediosa: ler a versão declarada em `dependencies` do `package.json` do app e usá-la como `requiredVersion` no bloco `shared` do `ModuleFederationPlugin`.

**Não** compartilha automaticamente tudo que está em `dependencies` — a lista de quais pacotes entram em `shared` continua 100% explícita em quem chama a função (isso é decisão de arquitetura: hoje só `react`/`react-dom` são compartilhados entre `auth-frontend` e `properties-frontend`, ver `docs/ARCHITECTURE.md` seção 06 — sharing indiscriminado de tudo aumentaria a superfície de conflito de versão sem necessidade).

## Uso

```ts
import { getSharedDependencies } from '@microfrontends/module-federation-utils'

const shared = getSharedDependencies(packageJson.dependencies, {
  react: { singleton: true, eager: true },
  'react-dom': { singleton: true, eager: true },
})
// => { react: { singleton: true, eager: true, requiredVersion: '^19.2.7' }, 'react-dom': { ... } }
```

## Por que ainda não está ligado nos `next.config.js` reais

`next.config.js` (`apps/auth-frontend`, `apps/properties-frontend`) é carregado pelo Node em CommonJS puro (`require`), sem passar pelo bundler do Next — é o próprio arquivo que _configura_ o bundler. Este pacote, como todo pacote deste monorepo, exporta `src/*.ts` direto (sem build step, ver seção 07 do `ARCHITECTURE.md`), pensado pra ser consumido via `transpilePackages` dentro de um app Next já rodando. `require()` de um `.ts` com `export` ESM fora desse contexto quebra (`SyntaxError: Unexpected token 'export'`).

Ligar isto de verdade exige decidir e implementar um build step próprio (`tsc` emitindo CommonJS pra `dist/`, `main` apontando pra lá) — não incluído aqui de propósito: a configuração atual de Module Federation nos dois apps já foi debugada a duras penas (RUNTIME-006, auto-scanner pegando o peer dependency interno do Next — ver comentários em `apps/*/next.config.js`) e trocar `shared: {...}` por uma chamada de função sem esse build step resolvido quebraria o `next dev`/`next build` dos dois apps. Ver issue de acompanhamento antes de religar.
