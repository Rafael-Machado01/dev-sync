# PR #8 — Feed de posts, sistema de likes e melhorias gerais

- **Status:** open
- **Link:** (a ser criado)

## Resumo

Implementa o feed completo com renderização de posts, sistema de like toggle, comentários e diversas correções de qualidade desde o PR #7.

## Funcionalidades novas

### Feed de posts (`a40293f`)

- `Post.tsx`: card de post com avatar, imagem (opcional), legenda, data e ID aleatório estilizado (`SYN_0x...`)
- `Posts.tsx`: componente servidor que busca todos os posts e renderiza o feed com header "FEED_RECENTE" + contagem
- `getAllPosts()`: server action com eager loading de `user`, `likes` e `comments`
- `Line.tsx`: componente de linha divisória reutilizável

### Sistema de likes (`718714e`)

- `LikeButton.tsx`: botão client-side com toggle visual (useState) + server action `likePost`
- `likePost(postId, userId)`: toggle — cria like se não existe, deleta se já curtiu
- Ícones SVG: `LikeButtonIcon`, `LikedButtonIcon`, `CommentButtonIcon`
- `shadow-glow-green` adicionado ao `globals.css`

### Comentários (estrutura)

- `addComment(postId, userId, content)`: server action para criação de comentário
- `deletePost()`, `getUserPosts()`: actions de gerenciamento de posts do usuário

## Correções

- `Label.tsx`: aspa solta removida do className
- `Card.tsx`: `hover` agora aplica `hover:shadow-glow-purple` (antes era estático), default `false`, className com nullish coalescing
- `User.ts`: adicionado import de `Comment` (faltava)
- `ProfileData.tsx`: `<Line>` entre título e bio para separação visual
- `Posts.tsx`: removido ternário idêntico (`session ? <NewPost/> : <NewPost/>`)

## Infra

- Removido `.idea/` do versionamento
- Adicionado `CHANGELOG.md` + pasta `docs/changelog/` com documentação de todos os PRs anteriores

## Arquivos

15 arquivos alterados/criados | +975 / −157 linhas

---

## Comentários

### Rafael-Machado01 — 2026-08-18
# Review — PR: Feed de posts, sistema de likes e melhorias gerais

Review geral: o **feed ficou funcional e visualmente consistente**, o **like toggle funciona bem** e a **qualidade dos componentes UI melhorou** desde o PR #7. Há pontos de **segurança**, **consistência de dados** e **performace** que valem tratar.

> Verificado com leitura completa dos 15 arquivos alterados.

---

### ✅ Boas práticas (parabéns)

1. **`Post.tsx` — componente limpo e bem estruturado**
   - Separação clara: header (ID + data), conteúdo (avatar + nome + imagem + caption), footer (likes). Cada seção com responsabilidade única.
   - Uso correto do `key={post.id}` no `.map()` em `Posts.tsx:40`.
   - Fallback de imagem consistente (`|| "/avatar.png"`) — mesmo padrão do `ProfileData`.

2. **`LikeButton.tsx` — estado local bem used**
   - Toggle otimista via `useState` + `setLiked(!liked)` antes da resposta do servidor. Usuário vê a mudança imediatamente, sem flicker.
   - Guard clause `if (!currentUserId) return null` — protege contra clique de usuário deslogado sem poluir o JSX.
   - Separação de `LikeButtonIcon` vs `LikedButtonIcon` — dois componentes SVG distintos, cada um com sua responsabilidade visual.

3. **`Card.tsx` — refactor de qualidade**
   - `hover = false` como default — agora quem usa precisa optar intencionalmente.
   - `className ?? ""` em vez de `className || ""` — trata `undefined` corretamente sem colapsar strings vazias.
   - `hover:shadow-glow-purple` (com prefixo `hover:`) — antes o glow era estático, agora só aparece no hover. Comportamento correto.

4. **`Label.tsx` — aspa solta corrigida**
   - A string quebrada `"mb-1.5" ${className}` virou `"mb-1.5" ${className}` — bug sutil mas importante, classes depois da aspa solta seriam ignoradas pelo Tailwind.

5. **`Line.tsx` — componente pequeno e reutilizável**
   - Extraído do padrão repetido `flex-1 h-px bg-linear-to-r from-drac-line/40 to-transparent`. Agora `ProfileData` e `Posts` usam o mesmo componente. Boa deduplicação.

6. **Server actions com `revalidatePath("/")`** — todas as mutações (`likePost`, `addComment`, `deletePost`) invalidam o cache corretamente. Padrão consistente.

---

### 🔴 Segurança / correção

1. **`likePost` — userId vindo do client** (`actions.ts:194`)
   ```ts
   export async function likePost(postId: string, userId: string)
   ```
   O `userId` é passado pelo componente `LikeButton` como prop. Qualquer um pode mandar o `userId` de outro usuário ecurtir/descurtir em nome dele. **Derive do `session.user.id`**:
   ```ts
   export async function likePost(postId: string) {
     const session = await auth();
     if (!session) throw new Error("Não autorizado!");
     const userId = session.user.id;
     // ... resto
   }
   ```
   Idem para `addComment` — o `userId` nunca deveria vir do client.

2. **`MyPosts.tsx:9` — passa `userId` que pode ser `null` para `getUserPosts`**
   ```ts
   const posts = await getUserPosts(userId); // userId: string | null
   ```
   `getUserPosts` espera `string`, mas recebe `string | null`. Isso vai quebrar no Prisma. Além disso, `session.user.userId` provavelmente não existe — o Prisma Adapter injeta `session.user.id`, não `userId`.

3. **`getUserPosts` — checa `session.user.userId` em vez de `session.user.id`** (`actions.ts:158`)
   ```ts
   if (session.user.userId !== userId)
   ```
   `session.user.userId` não existe — o NextAuth com Prisma Adapter define `session.user.id`. Esse check vai dar `undefined !== userId` e lançar erro toda vez. Idem em `deletePost` e `addComment`.

4. **`deletePost` é `export default`** (`actions.ts:170`)
   - Server actions com `export default` funcionam, mas é inconsistente com o resto do arquivo (todas as outras usam `export async function`). Padronize.

---

### 🟡 Duplicação / arquitetura

5. **Upload duplicado persiste** — `updateUserProfile` e `newPost` ainda repetem o mesmo bloco `mkdir` + `writeFile`. A sugestão do PR #7 de extrair para `app/lib/upload.ts` não foi aplicada. Ainda vale.

6. **`Posts.tsx` — busca o user duas vezes**
   ```ts
   const session = await getCurrentUser();     // auth() 1
   const user = await getUserByEmail(session?.email); // prisma query
   ```
   `getCurrentUser()` já retorna a sessão com `id`. `getUserByEmail` faz uma query ao banco só para ter o objeto `User` completo — mas o `NewPost` só usa `user` para o avatar. Se for só o avatar, derive da sessão. Se precisa do `User` completo, busque por `id` (`findUnique`), não por `email`.

7. **`Button` importado mas não usado** (`Posts.tsx:5`)
   ```ts
   import Button from "../ui/Button";
   ```
   Import morto. Remova.

8. **`likePost` — `findFirst` + delete/create separados** (`actions.ts:199-216`)
   Duas queries ao banco (find + delete ou create). Uma única query `upsert` com compound unique resolveria:
   ```ts
   // Se o schema tiver @@unique([postId, userId]) no Like:
   await prisma.like.upsert({
     where: { postId_userId: { postId, userId } },
     create: { postId, userId },
     delete: { postId_userId: { postId, userId } },
   });
   ```
   Se não tiver unique no schema, adicione uma migration.

---

### 🟠 UX / comportamento

9. **`LikeButton` — estado local dessincroniza do servidor**
   `setLiked(!liked)` assume que o servidor sempre aceita. Se o `likePost` falhar (rede, auth), o estado visual fica invertido. Considere usar `useOptimistic` do React 19 ou, no mínimo, reverter o estado no catch.

10. **`Post.tsx:44` — `<Image>` com `width={400} height={400}` mas `className="w-[400] h-[250]"`**
    As dimensões do `width/height` do `<Image>` divergem do CSS. Isso causa distorção ou `object-fill` forçado. Use dimensões consistentes ou deixe o `Image` ser responsivo com `fill` + container com `aspect-ratio`.

11. **`Post.tsx:38` — `post.createdAt.toLocaleDateString()` sem locale**
    Em server-side, `toLocaleDateString()` usa o locale do servidor (provavelmente `en-US`). Pode ser intencional, mas se quiser `pt-BR`, passe `{ locale: "pt-BR" }`.

---

### 🔵 Estilo / consistência

12. **`Post.tsx:30` — `className="w-[44] h-[44]"` no Avatar**
    Valores dinâmicos sem unidade (`w-[44]` em vez de `w-[44px]`) — o Tailwind pode não gerar a classe. Use `w-[44px] h-[44px]` ou `size-11` (44px = 11 * 4).

13. **`LikeButton.tsx:3` — import `Button` não usado**
    ```ts
    import Button from "../ui/Button";
    ```
    Import morto.

14. **`Line.tsx:6` — espaço extra no início do className**
    ```tsx
    className={` ${className} flex-1 ...`}
    ```
    O espaço antes de `${className}` é desnecessário e gera uma classe com espaço leading. Inverta a ordem: `${className ?? ""} flex-1 ...`.

15. **`actions.ts` — imports misturados com `type` no meio**
    ```ts
    export type FormState = { ... };
    import path from "path";
    ```
    `FormState` e `import path` estão no meio do arquivo, depois das exports. Mova todos os imports e types para o topo.

---

### 🔵 Pendências dos PRs anteriores (ainda abertas)

| # | PR | Issue |
|---|-----|-------|
| 16 | #7 | Upload sem validação MIME/tamanho — path traversal com `file.name` |
| 17 | #7 | Upload duplicado em `updateUserProfile` e `newPost` — extrair `saveUpload()` |
| 18 | #7 | Botão "Publicar" com desabilitação só visual (classe CSS) |
| 19 | #7 | `Popup.tsx` — `useEffect` sem array de dependências |
| 20 | #4 | Arquivos antigos em `/public/uploads` nunca são deletados |

---

**Prioridade sugerida:** **1–4 primeiro** (segurança — userId do client + tipos de sessão), depois **5–8** (deduplicação), e por último o resto.
