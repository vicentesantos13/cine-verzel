
## Cine-Verzel — Lista de Filmes (TMDb)

Aplicação full-stack para **buscar filmes** na API do  **TMDb** , **favoritar** títulos e **compartilhar** a lista por um link público

* **Front-end:** Next.js 15 (App Router), React, TailwindCSS
* **Formulários:** React Hook Form + Zod
* **Back-end:** Rotas de API do Next.js (Node.js)
* **Banco:** Prisma + SQLite (dev) — facilmente trocável por Postgres/MySQL
* **Empacotamento:** Turbopack
* **Gerenciador:** **npm** 

## Funcionalidades

* Navegação por  **abas (SPA)** :
  * **Browse:** `popular`, `top_rated`, `now_playing`, `upcoming`
  * **Trending:** `day` e `week`
  * **Search:** termo livre com validação **Zod**
* Exibição dos filmes com **nota TMDb** em destaque
* **Favoritar / remover** com **UI otimista**
* Lista própria persistida via **cookie httpOnly** `fav_list_id`
* **Link público** de compartilhamento: `/list/[id]`
* Página  **Meus Favoritos** : `/my-favorites`
* Página inicial: `/` (Catálogo)

## Estrutura

```
src/
  app/
    api/
      favorites/route.ts          # POST/DELETE/GET da lista do usuário (via cookie)
      lists/[id]/route.ts         # GET de lista pública por id (Next 15: params assíncrono)
      tmdb/browse/route.ts        # GET na API do TMDb para ações nas Tabs
      tmdb/search/route.ts	  # GET na API do TMDb para pesquisa de filme
      tmdb/trending/route.ts      # GET na API do TMDb para buscar os filmes em alta
    list/[id]/page.tsx            # Página pública com lista de filmes favoritados compartilhavel (SSR + client island)
    my-favorites/page.tsx         # Página do usuário comn lista de filmes favoritados (SSR + client island)
    page.tsx                      # Catálogo (SSR + client island)
    layout.tsx                    # Metadata template
  components/
    CatalogTabs.tsx
    Catalog.tsx
    Pagination.tsx
    SearchForm.tsx                # RHF + Zod
    MovieGrid.tsx / MovieCard.tsx
    favorites/
      FavoritesSection.tsx        # Reaproveitável (my-favorites e list/[id])
      FavoriteItemCard.tsx
    CopyButton.tsx                # copiar link (client)
  lib/
    tmdb.ts                       # chamadas server-only ao TMDb
    db.ts                         # prisma singleton
  schemas/
    searchSchema.ts
    deleteFavoriteSchema.ts
    upsertFavoriteSchema.ts
  types/
    tmdb.ts
    favorites.ts
prisma/
  schema.prisma

```



## Pré-requisitos

* Node.js 18+
* npm 9+
* Conta no TMDb (para  **API Key** )

## Configuração


#### 1) Clone & deps

```
git clone https://github.com/vicentesantos13/cine-verzel
cd cine-verzel
npm install

```


### 2) Variáveis de ambiente

Crie um arquivo **`.env`** na raiz:

```
# Banco (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nomedobanco?schema=public"

# TMDb
TMDB_API_KEY="SUA_CHAVE_TMDB"

# (opcional) URL absoluta do deploy — usada em compartilhamento
# NEXT_PUBLIC_BASE_URL="https://seu-deploy.vercel.app" #URL local"http://localhost:3000"

```

### 3) Prisma (gerar client e criar DB)

```
npx prisma generate
npx prisma migrate dev --name init

```



### 4) Rodar em desenvolvimento

`npm run dev `

## Scripts

```
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
  }
}

```



## Rotas principais

### Favoritos do usuário (cookie httpOnly)

* **GET** `/api/favorites`

  Retorna `{ id, items }` da lista associada ao **cookie** `fav_list_id`. Não cria lista se não existir.
* **POST** `/api/favorites`

  Corpo:

  ```
  {
    "movieId": 27205,
    "title": "Inception",
    "posterPath": "/abc.jpg",
    "overview": "…",
    "voteAverage": 8.7,
    "releaseDate": "2010-07-16"
  }
  ```

  Cria a lista (se necessário), salva o item e **define o cookie** com `httpOnly`, `sameSite=lax`.
* **DELETE** `/api/favorites`

  Corpo:

  <pre class="overflow-visible!" data-start="3746" data-end="3782"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-json"><span><span>{</span><span></span><span>"movieId"</span><span>:</span><span></span><span>27205</span><span></span><span>}</span><span>
  </span></span></code></div></div></pre>

  Remove o item correspondente. A rota aceita string/number via `z.coerce.number()`.

### Lista pública

* **GET** `/api/lists/[id]`

  Retorna a lista por `id`. **Atenção Next 15:** no handler use `const { id } = await ctx.params;`.



## Por que cookie?

* Vinculamos a **lista ao navegador** sem autenticação.
* Cookie **httpOnly** → não acessível no client, só no servidor.
* O link público `/list/[id]` permite compartilhar sem expor o cookie.



## Prisma — Modelos


```
model FavoriteList {
  id        String         @id @default(cuid())
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
  items     FavoriteItem[]
}model FavoriteItem {
 id          String       @id @default(cuid())
  list        FavoriteList @relation(fields: [listId], references: [id], onDelete: Cascade)
  listId      String
  movieId     Int
  title       String
  posterPath  String?
  overview    String?
  voteAverage Float
  releaseDate String?
  @@unique([listId, movieId])
}
```


## Páginas

* **`/`** – Catálogo (SSR + client island `CatalogClient`):

  Abas SPA, `SearchForm` (RHF + Zod), `MovieGrid`/`MovieCard`,  **UI otimista** .
* **`/my-favorites`** – Lê o cookie no server e renderiza `FavoritesSection` (client) com botão  **Copiar Link** .
* **`/list/[id]`** – Página pública (SSR + `FavoritesSection` reaproveitado em modo read-only).


## Config do `next/image`

Em `next.config.mjs` inclua o domínio do TMDb:

```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

```



## Decisões técnicas

* **Next 15 App Router** e separação Server/Client para desempenho e DX.
* **Banco de dados**:PostgresSQL, melhor integrado com prisma
* **Zod + RHF** garantem validação tipada (sem `any`).
* **UI otimista** com `Set<number>` para ids favoritados + rollback em erro.
* **Rotas mínimas** : `/api/favorites` (dono) e `/api/lists/[id]` (pública).
* **Cookie httpOnly** para persistir a lista sem autenticação.


## Troubleshooting

* **@prisma/client did not initialize yet**

  Rode `npx prisma generate` e confira `DATABASE_URL`.
* **Next 15: “params should be awaited”**

  Em rotas dinâmicas de API/páginas: `const { id } = await ctx.params;`.
* **Imagens não carregam**

  Verifique `images.remotePatterns` no `next.config.mjs`.
* **Botão não muda ao favoritar/remover**

  Garanta **UI otimista** e desabilite o botão enquanto a request está pendente.



## Licença

Uso educativo / avaliação técnica.
