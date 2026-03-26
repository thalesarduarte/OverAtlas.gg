# OverAtlas

OverAtlas é uma base real de projeto para um hub de Overwatch que mistura a lógica de wiki competitiva com tracker de perfis.

## O que já vem pronto

- Next.js com App Router e TypeScript
- Tailwind com tema escuro e visual de eSports
- Estrutura de páginas para home, login, cadastro, times, jogadores, campeonatos, notícias, favoritos, perfis e comparação
- Auth.js preparado para credentials e Battle.net OAuth
- Prisma com schema inicial para usuários, favoritos, times, jogadores, torneios e cache de perfil
- APIs mock para perfil e comparação
- Componentes reutilizáveis para cards, seções e gráficos

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Auth.js
- Prisma
- PostgreSQL
- Recharts

## Como rodar localmente

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Abra `http://localhost:3000`.

## Variáveis de ambiente

Use o arquivo `.env.example` como base.

### Obrigatórias

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`

### Para Battle.net OAuth

- `AUTH_BATTLENET_ID`
- `AUTH_BATTLENET_SECRET`
- `AUTH_BATTLENET_ISSUER`

## Estrutura principal

```text
src/
  app/
    api/
    compare/
    favorites/
    login/
    news/
    players/
    profiles/[battleTag]/
    register/
    teams/
    tournaments/
  components/
    layout/
    sections/
    stats/
    ui/
  lib/
  types/
prisma/
```

## Próximos passos recomendados

1. Trocar os mocks por integração real com banco e serviços externos.
2. Conectar os formulários de login e cadastro ao Auth.js.
3. Criar páginas individuais de time, jogador e campeonato.
4. Adicionar React Query para dados assíncronos e estados de loading.
5. Criar painel autenticado com favoritos reais.
6. Implementar ingestão e cache de perfil vindo de fonte externa.

## Subindo para o GitHub

```bash
git init
git add .
git commit -m "feat: initial OverAtlas project base"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/overatlas.git
git push -u origin main
```

## Observações

- Os dados atuais são demonstrativos.
- A autenticação Battle.net está preparada no projeto, mas depende de credenciais válidas.
- O front já está separado de um jeito que facilita crescer para produção.
