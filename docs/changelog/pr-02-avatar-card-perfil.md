# PR #2 — Avatar Card Perfil

- **Status:** merged
- **Merged em:** 2026-08-09
- **Link:** https://github.com/Rafael-Machado01/dev-sync/pull/2

Revisado com opencode.

## Novos componentes

- **Avatar.tsx** — componente reutilizável de avatar com opção de anel/ring roxo com glow.
- **Card.tsx** — componente de card com tema dracula, efeito hover com drop-shadow.
- **SideCardProfile.tsx** — card de perfil com foto de capa (`bgsetup.jpg`), avatar, nome, cargo ("Developer") e botão "[ EDITAR PERFIL ]".
- **auth-user.ts** — helper `getCurrentUser()` que retorna a sessão ou `null`.

## Alterações

- **SideCard.tsx** — agora usa `getCurrentUser()` e renderiza `SideCardProfile` (logado) ou `SideCardLoginButtons` (deslogado), dentro do novo `Card`. Removida chamada direta à `getUserByEmail` e o `auth`.
- **NavBar.tsx** — virou componente async; o botão LOGOUT só aparece se o usuário estiver logado.
- **layout.tsx** — limpeza: `NavBar` e `SideCard` saíram do layout raiz (agora vivem na página).
- **page.tsx** — layout de grid de 3 colunas (sidebar esquerda com `SideCard`, conteúdo central, sidebar direita) usando classes do `tailwindData`.
- **tailwindData.ts** — novas classes `gridLayoutSync`, `gridLayoutLeftSide`, `gridLayoutMain`, `gridLayoutRightSide` (layout sticky).
- **next.config.ts** — `images.domains` liberando `lh3.googleusercontent.com` e `avatars.githubusercontent.com`.
- **schema.prisma** — novo campo `title` no modelo `User`.

---

## Comentários

### Rafael-Machado01 — 2026-08-09
Revisado com opencode

### 🐛 Bugs
1. **`console.log(isLoggedIn)` em `SideCard.tsx`** — resto de debug; nunca deve ir para produção.
2. **`LayoutProps<"/">` em `layout.tsx`** — esse tipo não está definido em lugar nenhum do projeto (fiz uma busca e não existe). O arquivo nem deveria compilar — investigue por que o TypeScript não acusa o erro e remova o tipo fantasma.
3. **Campo `userId` vs `id` na sessão** — `next-auth.d.ts` declara `session.user.userId`, mas o `PrismaAdapter` injeta `session.user.id`. O campo `userId` nunca é preenchido. Entenda como o `callbacks.session` funciona no NextAuth v5 para injetar o `id` corretamente.
4. **Borda do `Card` não aparece** — `border-b-drac-purple` só define a *cor*; falta `border-width`/`border-style` para a borda renderizar. Revise a diferença entre os utilitários de cor e de width do Tailwind.

### 🔁 Duplicação de dados
5. **`SideCard` e `SideCardProfile` buscam a sessão separadamente** — o `SideCard` já sabe se o usuário está logado, e mesmo assim o `SideCardProfile` chama `auth()` + `getUserByEmail()` de novo. Aprendizado: em Server Components, faça a busca **uma vez** no componente pai e passe o dado por **props** ao filho. Isso também transforma o filho em componente síncrono (mais simples de testar).

### 🏗️ Organização
6. **`actions.ts` mistura queries e mutações** — `getUserByEmail` é uma *leitura* (camada de dados), `signIn`/`signOut` são *mutações* (server actions). Separe: queries em `lib/data/`, server actions em `actions/`.
7. **Tipos duplicados à mão** — `app/types/User.ts`, `Post.ts`, etc. espelham o schema Prisma. Ao mudar o schema, eles desatualizam. Prefira os tipos gerados pelo Prisma (`@prisma/client`).
8. **Componentes agrupados de forma genérica** — pastas por responsabilidade (`ui/`, `layout/`, `profile/`) em vez de tudo em `components/` ajuda na escala.

### ♿ Qualidade
9. **Cargo hardcoded "Devloper"** (com typo) — o schema já tem o campo `title`. Use o valor vindo do banco com um fallback.
10. **`<main>` aninhado dentro de `<aside>`** — deve existir apenas um `<main>` por página; `<aside>` pede conteúdo complementar.
11. **`images.domains` deprecated** — no Next 15/16 use `remotePatterns`. Vale ler o que mudou no config de imagens.
12. **Classes concatenadas com template literal** — com o tempo gera conflito de classes (ex.: `rounded-xl` base + `rounded-lg` na chamada). Estude `clsx` + `tailwind-merge` (o padrão do shadcn/ui).
13. **SVG com `width/height="800px"` hardcoded** — o ícone depende da classe `size-5` para ficar certo; remova os atributos fixos.
