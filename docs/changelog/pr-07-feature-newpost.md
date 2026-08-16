# PR #7 — Featature newPost

- **Status:** open
- **Link:** https://github.com/Rafael-Machado01/dev-sync/pull/7

## Alterações principais

### Nova feature — criação de posts

- `app/components/posts/NewPost.tsx`: formulário de criação de post com avatar do usuário, textarea de legenda (5–225 caracteres), preview de imagem e botão "Publicar" (desabilitado até a legenda ter o tamanho mínimo).
- `app/components/posts/Posts.tsx`: componente servidor que busca o usuário logado e renderiza o `NewPost`.
- `app/actions.ts`: nova server action `newPost` com validação de sessão/autorização (usuário deve ser o dono do `id`), upload da imagem para `public/uploads` e criação do registro via Prisma (`prisma.post.create`), seguido de `revalidatePath("/")`.
- `app/page.tsx`: integra o feed de posts no `main` do layout.

### Modelo de dados

- `prisma/schema.prisma` + migration: `Post.imageUrl` agora é opcional (`String?`), permitindo posts apenas com legenda.
- `app/types/Post.ts`: `imageUrl` atualizado para `string | null`.

### Componentes de UI

- `ImagePreview.tsx`: implementado preview da imagem selecionada (FileReader + Data URL) com botão "Remover Imagem" e input de arquivo escondido.
- `TextArea.tsx` (novo): textarea estilizado reutilizável.
- `Input.tsx` / `Label.tsx`: classes extraídas para `tailwindData`; `Label` agora aceita `className` e `children` (permitindo input aninhado).
- `Avatar.tsx`: simplificação do anel/borda.
- `Card.tsx`, `Modal.tsx`, `FormEditProfile.tsx`: pequenos ajustes de estilo; botão "Salvar" do perfil agora usa `tailwindData.saveButton`.
- `app/constants/tailwindData.ts`: novas entradas `input`, `saveButton` e `disabledButton`.

---

## Comentários

### Rafael-Machado01 — 2026-08-16
# 🧹 Sugestões de refatoração

Review de qualidade, sem bloqueios. A feature funciona, mas há pontos de **segurança**, **duplicação** e **qualidade** que valem a pena tratar antes de evoluir o feed.

### 🔴 Segurança / correção

1. **Upload de arquivos sem validação** — `app/actions.ts:74-92` e `app/actions.ts:130-139`
   - Nenhuma validação de **tipo** (`accept="image/*"` é só UI) nem de **tamanho**. Dá pra enviar qualquer arquivo (`.html`, `.js`, executáveis) para `/public/uploads`, que é servido publicamente.
   - **Path traversal**: usa `imageFile.name` direto no `path.join`. `../../algo` poderia gravar fora do diretório. Use um nome aleatório (`crypto.randomUUID()` + extensão sanitizada).
   - **Colisão de nomes**: dois usuários com o mesmo nome de arquivo sobrescrevem o upload um do outro.
   - Sugestão mínima: gerar nome único + checar `file.type` e `file.size`.
   - Ideal a longo prazo: armazenar em S3/R2/Blob em vez de disco.

2. **`id` vindo de campo escondido** — `app/actions.ts:119` e `:45`
   - O check `session.user.id !== id` protege, mas é redundante e frágil. Prefira **derivar do próprio `session.user.id`** e apagar o input hidden.
   - `newPost`: o servidor só valida `!caption`, enquanto a UI exige mínimo 5. Valide o mesmo limite no servidor (`caption.trim().length < 5`).

3. **Bug de tipo em `app/types/User.ts:18`** — `comments?: Comment[]` sem `import { Comment }` (só importa `Like` e `Post`). Vai quebrar o type-check.

4. **Import morto** — `app/actions.ts:8` `redirect` importado e nunca usado (o ESLint deve estar reclamando).

### 🟡 Duplicação / arquitetura

5. **Upload duplicado em 2 lugares** — `updateUserProfile` e `newPost` repetem o mesmo bloco de `mkdir` + `writeFile`. Extraia para `app/lib/upload.ts`:

   ```ts
   export async function saveUpload(file: File, folder = "uploads") {
     const uploadDir = path.join(process.cwd(), "public", folder);
     await fs.mkdir(uploadDir, { recursive: true });
     const fileName = `${crypto.randomUUID()}-${path.basename(file.name)}`;
     await fs.writeFile(
       path.join(uploadDir, fileName),
       Buffer.from(await file.arrayBuffer()),
     );
     return `/${folder}/${fileName}`;
   }
   ```

6. **FileReader duplicado** — `ImagePreview.tsx:8-18` e `FormEditProfile.tsx:23-43`. Extraia um hook `useFilePreview()` (ou use `URL.createObjectURL(file)`).

7. **`Posts.tsx:9`** — `{session ? <NewPost/> : <NewPost/>}`: os dois branches são idênticos. Deixe só `<NewPost user={user} />`. Além disso `getCurrentUser()` e `getUserByEmail()` disparam `auth()` duas vezes seguidas — dá pra buscar o user de uma vez só a partir da sessão.

8. **Tipos duplicados à mão** — `app/types/User.ts`, `Post.ts`, `Like.ts`, `Comment.ts` espelham o schema Prisma. Considere derivar direto do client (`Prisma.UserGetPayload<...>` / `User` de `@prisma/client`) para não divergir.

### 🟠 UX / comportamento

9. **Botão "Publicar"** — `NewPost.tsx:58`: a "desabilitação" é só visual (classe). Use `disabled={canPost.trim().length < 5}` no `<button>` para impedir o submit de verdade.

10. **Reset do form** — `NewPost.tsx:14-27`: o hack do `imageKey` para resetar o preview funciona, mas é frágil. Dê um `ref` ao `<form>` e chame `formRef.current?.reset()` após sucesso. O estado `canPost` funciona, mas daria pra derivar como `boolean`.

11. **`Popup.tsx:9-14`** — `useEffect` sem array de dependências (`[]`): o timer reinicia a cada re-render e o popup nunca some no tempo esperado. Adicione `[]` (ou dependência em `message`).

12. **`Label.tsx:16`** — aspas soltas no meio da string de classe:

    ```ts
    className={`block mt-2 text-xs text-drac-comment font-bold mb-1.5" ${className}`}
    ```

    Sobrou um `"` no final. E `FormEditProfile.tsx:129` passa `id="title"` num `<label>` (não deveria estar lá).

### 🔵 Estilo / consistência

13. **Tailwind dinâmico não gera classe** — `Avatar.tsx:28` usa `w-[${size}] h-[${size}]` com template string; o Tailwind não enxerga valores dinâmicos, então essas classes nunca existem (o `width/height` do `<Image>` já resolve). Remova. Idem `w-[44] h-[44]` nos callers.

14. **Formatação inconsistente** — `NewPost.tsx` sem `;` no final dos imports e `"use client"`, espaçamento em `{newPost}`. Configure o ESLint/Prettier pra padronizar.

15. **`tailwindData` como constante mutável** — ok como "design tokens", mas hoje mistura grid, botões e input. Se crescer, vale separar ou usar `@theme` do Tailwind v4.

16. **Arquivos órfãos** — quando o usuário troca avatar/capa, o arquivo antigo em `/public/uploads` nunca é deletado. Acumula lixo no disco.

---

Prioridade sugerida: **1–4 primeiro** (segurança/correção), depois **5–8** (deduplicação), e por último o resto.
