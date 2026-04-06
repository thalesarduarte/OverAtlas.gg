# OverAtlas

OverAtlas e uma plataforma Next.js para acompanhar Overwatch esports com foco em ingestao de dados, catalogo estilo wiki, favoritos, perfis e comparacao de jogadores.

O projeto evoluiu da base inicial para uma arquitetura real orientada a banco:

- ingestao modular por conectores (`official`, `liquipedia`, `owtv`)
- normalizacao, reconciliacao e upserts com Prisma
- paginas publicas principais lendo do PostgreSQL
- home premium com dados reais de torneios, partidas, noticias, rankings e feed do usuario
- paginas individuais para times, jogadores, torneios, partidas e noticias
- autenticacao com Auth.js, credentials e conexao Battle.net
- favoritos resolvendo entidades reais do banco
- cache de perfil/comparacao pronto para trocar o provider mock por integracao externa real

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Auth.js
- Zod
- React Query
- Recharts

## Setup local

1. Instale as dependencias:

```bash
npm install
```

2. Configure o ambiente criando `.env` com base nas variaveis abaixo.

3. Gere o client do Prisma:

```bash
npm run prisma:generate
```

4. Sincronize o schema com o banco:

```bash
npx prisma db push
```

Se voce preferir migrations locais:

```bash
npm run prisma:migrate
```

5. Opcionalmente rode o seed:

```bash
npm run seed
```

6. Rode o projeto:

```bash
npm run dev
```

Para testar build de producao:

```bash
npm run build
npm run start -- --port 3000
```

## Variaveis de ambiente

Obrigatorias:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`

Battle.net OAuth:

- `AUTH_BATTLENET_ID`
- `AUTH_BATTLENET_SECRET`
- `AUTH_BATTLENET_ISSUER`

Ingestao/admin:

- `SYNC_ADMIN_TOKEN`
- `LIQUIPEDIA_USER_AGENT`
- `LIQUIPEDIA_THROTTLE_MS`
- `LIQUIPEDIA_USE_MOCK`

Observacao:

- os conectores de ingestao ja estao prontos para integracoes reais, mas alguns fetchers ainda possuem fallback mockado ou TODOs localizados onde a fonte externa final ainda nao foi plugada

## Banco de dados

Entidades principais no Prisma:

- `User`, `Account`, `Session`, `VerificationToken`
- `Favorite`, `LinkedProfile`
- `Team`, `TeamAlias`, `TeamRanking`
- `Player`, `PlayerAlias`, `PlayerTeamHistory`
- `Tournament`, `TournamentStage`
- `Match`
- `Roster`
- `NewsPost`
- `ExternalRef`
- `SyncJob`
- `CachedProfile`, `CachedHeroStat`

## Ingestao

A camada de ingestao fica em `src/lib/ingest` e esta separada em:

- `connectors`
- `normalizers`
- `reconcilers`
- `upserts`
- `jobs`
- `utils`

Conectores preparados:

- `officialConnector`
- `liquipediaConnector`
- `owtvConnector`

Jobs:

- `syncOfficial`
- `syncLiquipedia`
- `syncOWTV`
- `syncDaily`

Endpoints administrativos:

- `POST /api/admin/sync/official`
- `POST /api/admin/sync/liquipedia`
- `POST /api/admin/sync/owtv`
- `POST /api/admin/sync/all`

Autorizacao:

- sessao autenticada
- ou header com `SYNC_ADMIN_TOKEN`

Logs de sync:

- inicio
- fim
- origem
- total processado
- criados
- atualizados
- falhas

## Dados publicos e paginas

As paginas abaixo usam leitura real do banco:

- `/`
- `/teams`
- `/players`
- `/tournaments`
- `/news`
- `/teams/[slug]`
- `/players/[slug]`
- `/tournaments/[slug]`
- `/matches/[slug]`
- `/news/[slug]`

Camada server-side de leitura:

- `src/lib/atlas-data.ts`

Ela cobre:

- listagem com busca, filtros, ordenacao e paginacao
- busca por slug
- rankings
- dashboard/home

## Favoritos e feed

Favoritos agora resolvem entidades reais salvas no banco:

- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites`
- `GET /api/feed`

As resolucoes de favoritos ficam separadas entre:

- `src/lib/favorites.ts` para tipos compartilhados e cache otimista client-side
- `src/lib/favorites.server.ts` para resolucao real com Prisma

## Perfil e comparacao

Rotas:

- `GET /api/profile?battletag=`
- `GET /api/compare?player1=&player2=`

Arquitetura:

- provider desacoplado
- cache em banco com TTL de 5 minutos
- fallback para ultimo cache valido
- estrutura pronta para trocar o provider mock por parser/servico externo real

## Estrutura principal

```text
prisma/
src/
  app/
    api/
      admin/
      auth/
      compare/
      favorites/
      feed/
      profile/
    compare/
    matches/
    news/
    players/
    profile/
    teams/
    tournaments/
  components/
    auth/
    compare/
    favorites/
    layout/
    sections/
    stats/
    ui/
  hooks/
  lib/
    ingest/
    atlas-data.ts
    auth.ts
    favorites.ts
    favorites.server.ts
    feed.ts
    profile-service.ts
    presentation.ts
  types/
```

## Comandos uteis

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run seed
npm run build
```

## Status atual e proximos passos naturais

O projeto ja esta em um estado funcional bem mais proximo de produto real. Os principais pontos ainda pensados para evolucao sao:

- conectar os fetchers mockados restantes a fontes externas reais
- enriquecer paginas detalhadas com mais relacoes historicas conforme o banco crescer
- ampliar observabilidade dos jobs de sync
- adicionar testes automatizados para a camada de ingestao e leitura
