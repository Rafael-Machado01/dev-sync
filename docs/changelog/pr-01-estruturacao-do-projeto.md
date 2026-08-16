# PR #1 — Estruturação do projeto + Header + SideCard de Login

- **Status:** merged
- **Merged em:** 2026-08-08
- **Link:** https://github.com/Rafael-Machado01/dev-sync/pull/1

- Estrutura o projeto: move tipos para `app/types/`, cria constantes de tailwind, novo botão reutilizável (Button) e import do globals.css no layout.
- Adiciona NavBar fixo no topo com o novo logo SVG (sync.).
- Implementa o SideCard de login com botões "Entrar com Google" e "Entrar com GitHub", com logos em SVG.
- Integra o Prisma Adapter ao NextAuth e cria a action `signInWithProvider` para autenticação por provedor.
- Adiciona dependência `@auth/prisma-adapter`.

---

## Comentários

### Rafael-Machado01 — 2026-08-06
Revisado com opencode:

**Bugs**
- `NavBar.tsx:8` — `height-[62px]` não é classe válida do Tailwind, deveria ser `h-[62px]`.
- `Logo.tsx` — usa `animation: "float..."`, mas o `@keyframes float` nunca é definido no CSS, então a animação não roda.
- `tailwindData.ts:2` — `border border-b-drac-purple` aplica roxo só na borda de baixo (as outras ficam transparentes). Se a intenção é borda inteira, use `border border-drac-purple`.

**HTML/estrutura**
- `SideCard.tsx` e `SideCardLoginButtons.tsx` usam `<main>` um dentro do outro (`layout.tsx` renderiza os dois aninhados) — HTML inválido. Use `<div>`/`<aside>`.
- Formulários duplicados para Google/GitHub em `SideCardLoginButtons` — extraia um array de providers `[{provider, label, icon}]` e faça um map. Remove duplicação.
- Capitalize "Google" no texto do botão.

**Limpando**
- `SideCard.tsx:8,10` — `console.log(session)` e `console.log(user)` são logs de debug, remover.
- `actions.ts:6` — import `path` não usado.
- `actions.ts:10` — `findFirst` → `findUnique` (email já é único no schema).
- `auth.ts` — falta quebra de linha no fim do arquivo.

**Arquitetura/otimização**
- Com `PrismaAdapter`, a `session.user` já traz o usuário; buscar no banco de novo com `getUserByEmail` só para checar se está logado é desnecessário. Use `session?.user` diretamente.
- `Button.tsx:6` — `type` deveria ter default `"button"`; e em vez de reimplementar `onClick`, estenda `ButtonHTMLAttributes<HTMLButtonElement>` para aceitar todas as props nativas (menos código, mais flexível).

### Rafael-Machado01 — 2026-08-08
Adicione a funcionalidade de logout.

### Rafael-Machado01 — 2026-08-08
on opencode

**Funcionalidade nova**
- Cria a action `logout()` em `app/actions.ts` (envia `signOut` do NextAuth).
- Novo ícone SVG `LogoutIcon` e botão LOGOUT no canto direito da NavBar.

**Correções de bugs**
- `NavBar`: `height-[62px]` (classe inválida) → `h-15.5`.
- `Logo`: a animação float agora tem `@keyframes` definidos em `globals.css`, então passa a rodar de fato (aplicada ao texto da logo).

**Limpeza / refatoração**
- Remove `console.log` de debug do `SideCard`.
- Remove import não utilizado (`path`) e troca `findFirst` → `findUnique` em `getUserByEmail` (email é único no schema).
- `auth.ts`: formatação e quebra de linha no fim do arquivo.
- `SideCardLoginButtons`: formulários duplicados (Google/GitHub) substituídos por um `.map()` sobre `app/constants/login-providers.ts` (array `{name, provider, icon}`), com "Google" capitalizado.
- `globals.css`: realinha variáveis do tema.

**Observações não resolvidas neste commit (para uma próxima rodada)**
- `SideCard` ainda consulta o banco com `getUserByEmail` — com o `PrismaAdapter`, `session?.user` já basta.
- `Button.tsx` ainda reimplementa `onClick` na interface; idealmente deveria estender `ButtonHTMLAttributes`.
- `tailwindData.signInButton` ainda usa `border-b-drac-purple` (só a borda de baixo fica roxa).
