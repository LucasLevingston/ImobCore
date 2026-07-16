# Mapeamento de Funcionalidades Futuras

Documento de planejamento — nada aqui está implementado. Mapeia funcionalidades de negócio pra além do CRUD de imóveis atual (Fase 4/5), pra virar roadmap de fases futuras. Ver `docs/ARCHITECTURE.md` seção 31 pro roadmap técnico já concluído.

Cada item: **o que é**, **por que importa** (valor de negócio real, não feature por feature), **onde entra** na arquitetura atual, **complexidade** (S/M/L), **depende de**.

---

## 1. CRM — Gestão de Clientes/Leads

Cadastro de cliente/lead, funil (lead → visita → proposta → fechamento), histórico de interações, tags/segmentação (comprador/locatário/investidor).

**Por que importa:** hoje o Portal já tem o módulo "Clientes" como placeholder (`docs/ARCHITECTURE.md` seção 05a) — é o próximo módulo natural a sair do placeholder. Sem CRM, corretor gerencia lead em planilha fora da plataforma.

**Onde entra:** novo microservice `clients-service` (mesmo padrão de `properties-service` — Fastify+Prisma+Postgres próprio, Clean Architecture). `brokerId` já existe em `Property` como referência solta — o mesmo padrão (sem FK cross-service) se aplica a `Client.brokerId`.

**Complexidade:** L (serviço novo completo, TDD, Dockerfile, CI).

**Depende de:** nada. Pode começar já.

---

## 2. Agendamento de Visitas

Calendário de visita a imóvel, vínculo `Client + Property + Broker + horário`, confirmação, feedback pós-visita (interessado/não interessado/motivo).

**Por que importa:** módulo "Visitas" também já é placeholder no Portal. É o segundo maior gargalo operacional depois do CRM (hoje é WhatsApp + agenda pessoal).

**Onde entra:** pode viver dentro de `clients-service` (visita é uma sub-entidade do relacionamento cliente↔corretor) ou um `visits-service` próprio se o volume justificar — decisão de escopo pra quando for planejada, não agora.

**Complexidade:** M.

**Depende de:** CRM (item 1) — visita sem cliente cadastrado não faz sentido.

---

## 3. Propostas e Negociação

Proposta formal (valor, condições, prazo), contraproposta, histórico de negociação, estado (`enviada/aceita/recusada/expirada`).

**Por que importa:** é o passo que efetivamente gera receita (comissão). Hoje não existe nenhum registro estruturado disso.

**Onde entra:** `clients-service` ou serviço próprio `deals-service`, dependendo de quão complexo o fluxo de negociação ficar.

**Complexidade:** M.

**Depende de:** CRM (item 1).

---

## 4. Contratos e Documentos

Geração de contrato (locação/venda) a partir de template, upload de documento (RG, comprovante de renda), checklist de documentação obrigatória por tipo de negócio, assinatura eletrônica (integração externa — ex: Clicksign/DocuSign).

**Por que importa:** fecha o ciclo — sem isso a plataforma para na proposta e o resto continua manual.

**Onde entra:** novo `documents-service` — armazenamento de arquivo é uma responsabilidade de infra bem diferente das outras (upload, storage tipo S3/R2, geração de PDF), justifica isolamento.

**Complexidade:** L.

**Depende de:** Propostas (item 3).

---

## 5. Financeiro — Comissões e Cobranças

Cálculo de comissão por venda/locação (split entre corretor e imobiliária), emissão de boleto/cobrança recorrente de aluguel, controle de inadimplência.

**Por que importa:** é dinheiro de verdade — a parte que a imobiliária mais quer automatizar.

**Onde entra:** `billing-service` novo. Precisa de gateway de pagamento externo (Stripe, Asaas, ou similar) — decisão de fornecedor fica pra quando for planejado.

**Complexidade:** L (regras de negócio financeiras são historicamente a parte mais sujeita a bug de todo sistema — TDD não é opcional aqui).

**Depende de:** Contratos (item 4).

---

## 6. Portal do Cliente (área logada pro comprador/locatário)

Cliente final loga, acompanha status da proposta, vê documentos pendentes, favoritos.

**Por que importa:** reduz o "cadê meu processo?" que hoje é 100% via corretor.

**Onde entra:** app novo, ex. `apps/client-portal` — mesma stack (Next.js App Router), autenticação via `auth-service` já existente (mas com um novo `role`/tipo de usuário — `Client` vs `Broker`, decisão de modelo de dados pra planejar).

**Complexidade:** M-L.

**Depende de:** Propostas (item 3) pra ter o que mostrar de status.

---

## 7. Busca Avançada + Recomendação via IA

Recomendação de imóveis similares, geração automática de descrição de imóvel, chat assistente pra busca em linguagem natural.

**Por que importa:** os contratos já existem (`docs/ARCHITECTURE.md` seção 10 — `AIProvider`, `EmbeddingProvider`, `ChatProvider`, `PropertyRecommendationProvider`, `DescriptionGeneratorProvider`), criados de propósito na Fase 4 pra essa fase futura plugar sem tocar em `domain`/`application`. Módulo "IA" do Portal já é placeholder esperando exatamente isso.

**Onde entra:** implementação concreta das interfaces já definidas em `properties-service/src/domain/ai/` — provedor real (OpenAI/Bedrock/local) fica atrás da interface, decisão de fornecedor pra quando for planejado.

**Complexidade:** M (a interface já existe, é "só" plugar um provider real + UI de chat).

**Depende de:** nada tecnicamente — é o item com menor fricção de arquitetura pra começar, já que o contrato foi feito de propósito antes.

---

## 8. Match de Leads (busca salva + notificação)

Cliente cadastra critério de busca (orçamento, bairro, tipo, quartos), sistema notifica quando imóvel compatível é cadastrado.

**Por que importa:** transforma o CRM de passivo (corretor precisa lembrar de avisar) pra ativo.

**Onde entra:** `clients-service` (busca salva) + um worker/job (fila) que roda no cadastro de `Property` e casa contra buscas salvas — primeira necessidade real de fila assíncrona no projeto (hoje tudo é HTTP síncrono).

**Complexidade:** M.

**Depende de:** CRM (item 1), Notificações (item 12).

---

## 9. Mídia — Tour Virtual e Plantas

Upload de fotos/vídeo, tour 360°, planta baixa anexada ao imóvel.

**Por que importa:** listagem sem foto boa não vende — é tabela stakes pra qualquer portal imobiliário real.

**Onde entra:** `Property` ganha relação com um novo storage de mídia — mesmo serviço de storage de Documentos (item 4) reaproveitado, ou `properties-service` ganha um sub-módulo de mídia se o volume não justificar serviço próprio.

**Complexidade:** M.

**Depende de:** nada obrigatório, mas reaproveita infra de storage se Documentos (item 4) já existir.

---

## 10. Avaliação Automática de Imóvel (AVM)

Estimativa de valor de mercado baseada em imóveis comparáveis (mesma região/tipo/área) já cadastrados.

**Por que importa:** ajuda corretor a precificar, e é um caso de uso natural pra IA (item 7) usar os próprios dados da plataforma.

**Onde entra:** use case novo em `properties-service`, consumindo `PropertyRecommendationProvider` (contrato já existente) num modo diferente (comparáveis por preço, não por similaridade de busca).

**Complexidade:** M.

**Depende de:** IA (item 7) — é basicamente uma aplicação específica da mesma infra.

---

## 11. Gestão de Corretores/Equipe (multi-usuário por imobiliária)

Hierarquia (admin/gerente/corretor), permissões por papel, metas e ranking de performance.

**Por que importa:** hoje `auth-service` tem só `User` genérico, sem papel/hierarquia — necessário antes de qualquer feature que dependa de "quem pode ver o quê" (ex: gerente vê métricas de todos os corretores, corretor só vê as próprias).

**Onde entra:** `auth-service` ganha `role` em `User` + tabela de vínculo `Broker → Team`. Módulo "Administração" do Portal (hoje placeholder) é a UI natural pra isso.

**Complexidade:** M — mexe em auth, que é sensível, precisa de cuidado extra com migração de dados existentes.

**Depende de:** nada, mas é **pré-requisito** de várias outras (Financeiro precisa saber de quem é a comissão, Analytics por corretor precisa saber a hierarquia).

---

## 12. Notificações (email/push/SMS)

Disparo de notificação pra eventos (novo lead, visita agendada, proposta recebida, match de busca salva).

**Por que importa:** é infra transversal — praticamente todo item acima (CRM, Visitas, Propostas, Match) precisa disso pra ser útil de verdade, não só um registro passivo no banco.

**Onde entra:** `notifications-service` novo, com fila (RabbitMQ/SQS) — primeira necessidade real de mensageria assíncrona do projeto. Provedores (SendGrid/SES pra email, Twilio pra SMS, FCM/OneSignal pra push) ficam atrás de uma interface, mesmo padrão DIP já usado pra IA.

**Complexidade:** M.

**Depende de:** nada tecnicamente, mas só tem valor real depois que existir algum evento de negócio pra notificar (CRM, Visitas).

---

## 13. Analytics Avançado

Funil de conversão (lead → visita → proposta → fechamento), tempo médio de venda, ranking de corretor, imóveis parados há mais tempo.

**Por que importa:** módulo "Analytics" do Portal já é placeholder. Dashboard atual (`properties-service` `GET /properties/metrics`) só agrega imóvel — isso expande pra métricas de funil, que exigem dados de CRM/Propostas existirem primeiro.

**Onde entra:** pode virar um `analytics-service` de leitura (agregações pesadas fora do caminho crítico de escrita dos outros services) ou queries federadas no Portal — decisão de arquitetura pra quando o volume de dado justificar.

**Complexidade:** M-L.

**Depende de:** CRM (item 1), Propostas (item 3), Corretores (item 11).

---

## 14. Integração com Portais Externos

Publicar imóvel automaticamente em OLX, ZAP Imóveis, Viva Real via API/XML feed.

**Por que importa:** é onde o lead de verdade chega pra maioria das imobiliárias — sem isso a plataforma é só um sistema interno, não gera demanda.

**Onde entra:** `properties-service` ganha um adapter de exportação por portal (cada um tem formato de feed próprio, geralmente XML) — mesmo padrão DIP (interface `ListingExporter`, implementação concreta por portal).

**Complexidade:** M por portal (repetitivo, mas cada integração é isolada e não bloqueia as outras).

**Depende de:** nada.

---

## 15. Auditoria / Histórico de Alterações

Log de quem mudou o quê e quando em `Property`/`Client`/etc — não é log técnico (Pino, seção 26), é log de negócio consultável na UI.

**Por que importa:** obrigatório pra imobiliária resolver disputa ("quem mudou o preço desse imóvel?") e é requisito comum de compliance no setor.

**Onde entra:** cada service ganha uma tabela `*AuditLog` (event sourcing simplificado) ou um `audit-service` central que recebe eventos — decisão entre os dois fica pra quando for planejado.

**Complexidade:** M.

**Depende de:** nada, mas fica mais barato de implementar cedo (retrofit em serviço maduro é mais caro).

---

## 16. Multi-tenancy (múltiplas imobiliárias na mesma plataforma)

Hoje o projeto assume implicitamente uma imobiliária só. "SaaS para Imobiliárias" (plural, no título do projeto) sugere suportar várias — precisa decidir isolamento por schema, por banco, ou por coluna `tenantId` antes de qualquer outra feature crescer muito, porque é uma mudança que fica exponencialmente mais cara depois.

**Por que importa:** é a diferença entre "sistema interno de uma imobiliária" e "produto SaaS vendável pra várias".

**Onde entra:** decisão transversal a TODOS os services — `tenantId` em cada entidade, ou banco por tenant (mais isolado, mais caro operacionalmente). Afeta `auth-service` (usuário pertence a um tenant), `properties-service`, e todo serviço futuro.

**Complexidade:** L, e **urgência de decisão é maior que a complexidade de implementação** — quanto mais os outros itens desse mapa forem implementados sem isso decidido, mais caro fica migrar depois.

**Depende de:** nada, mas bloqueia/encarece retroativamente todos os outros itens se for adiada demais.

---

## 17. Favoritos / Comparador de Imóveis

Cliente favorita imóvel, compara 2-3 lado a lado (área, preço, condomínio, características).

**Por que importa:** feature de UX pequena, alto valor percebido, baixo custo — bom item pra intercalar entre os grandes.

**Onde entra:** `properties-frontend` (estado local/Zustand) + `properties-service` ganha `GET /properties/compare?ids=`. Se existir Portal do Cliente (item 6), favorito persiste por usuário; sem ele, fica em localStorage.

**Complexidade:** S.

**Depende de:** nada.

---

## 18. Billing da Plataforma (assinatura das imobiliárias-cliente)

Cobrança recorrente da própria imobiliária pelo uso da plataforma (planos, trial, upgrade/downgrade).

**Por que importa:** é o modelo de receita do produto em si (diferente do item 5, que é comissão do CORRETOR — este é a mensalidade da IMOBILIÁRIA pra usar o SaaS).

**Onde entra:** `platform-billing-service` novo, integração com Stripe (ou similar) via webhook.

**Complexidade:** M-L.

**Depende de:** Multi-tenancy (item 16) — não tem o que cobrar por tenant se tenant não existe como conceito ainda.

---

## Sequenciamento sugerido (não vinculante — é ponto de partida pra discussão)

```
Fundação (decide cedo, fica caro adiar):
  16. Multi-tenancy
  11. Corretores/Equipe (role em User)

Alto valor / baixo acoplamento (pode começar já, contrato pronto):
  7.  IA — recomendação/descrição (interface já existe)
  17. Favoritos/Comparador

Núcleo operacional (o que a imobiliária mais sente falta hoje):
  1.  CRM
  2.  Visitas          (depende de 1)
  3.  Propostas         (depende de 1)
  12. Notificações      (ganha valor real junto com 1/2/3)

Fecha o ciclo comercial:
  4.  Contratos/Documentos  (depende de 3)
  5.  Financeiro/Comissões  (depende de 4)

Expansão:
  6.  Portal do Cliente     (depende de 3)
  8.  Match de Leads        (depende de 1, 12)
  9.  Mídia/Tour Virtual
  10. AVM                   (depende de 7)
  13. Analytics avançado    (depende de 1, 3, 11)
  14. Integração portais externos
  15. Auditoria
  18. Billing da plataforma (depende de 16)
```

Este documento não define datas nem compromisso — é insumo pra próxima rodada de planejamento de fase, no mesmo formato TDD/fase-a-fase já usado em `docs/ARCHITECTURE.md` seção 31.
