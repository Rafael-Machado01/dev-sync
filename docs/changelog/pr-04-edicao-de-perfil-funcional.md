# PR #4 — Edição de perfil funcional

- **Status:** merged
- **Merged em:** 2026-08-15
- **Link:** https://github.com/Rafael-Machado01/dev-sync/pull/4

## Resumo

Completa a feature de edição de perfil iniciada no PR #3 (Modal add): agora o modal abre um formulário funcional que permite editar nome, cargo, bio, localização e trocar capa/avatar (com upload e preview). Inclui também a componentização de inputs reutilizáveis e as correções apontadas na review do PR #3.

## O que mudou

### Nova feature: Edição de perfil funcional

- **`app/actions.ts`** — nova server action `updateUserProfile`:
  - Verifica sessão (`auth()`) e valida que o usuário só edita o próprio perfil (`session.user.id === id`)
  - Faz upload de capa (`background`) e avatar (`image`) para `public/uploads/` via `fs`
  - Persiste com `prisma.user.update` e chama `revalidatePath("/")`
  - Retorna `FormState` (`message`/`type`) para feedback no formulário
- **`sidecard/FormEditProfile.tsx`** (novo) — formulário com `useFormState` + `encType="multipart/form-data"`:
  - Preview de capa e avatar via `FileReader` antes do envio
  - Campos: Nome, Cargo, Bio, Localização (com fallbacks `bgsetup.jpg` / `avatar.png`)
  - Mensagem de sucesso/erro renderizada acima do form
- **`sidecard/EditProfile.tsx`** — agora recebe `user` via prop e renderiza `<FormEditProfile user={user} />` no modal (substitui o placeholder `"a"`)
- **`sidecard/SideCardProfile.tsx`** — virou componente async que busca o usuário com `getCurrentUser()` e repassa via props (remove a busca duplicada de dentro do `ProfileData`)
- **`sidecard/ProfileData.tsx`** — recebe `user` como prop; exibe `bio`; fallback de avatar `/avatar.png`; ícone de localização em verde

### Correções da review do PR #3

- `Modal.tsx` agora é **controlado** pelo pai (`isOpen`/`onClose`), removidos `useState` interno e `"use client"` que quebravam a segunda abertura
- `ProfileData` restaura fallback de imagem (prévia de capa/avatar com `??` em vez de `src={null}`)
- Removidos imports mortos (`page.tsx` deixa de importar `Modal` sem usar)

---

## Comentários

### Rafael-Machado01 — 2026-08-14
# Revisão — PR: Edição de perfil funcional

Review geral: a **feature tá no caminho certo**, mas **o build está quebrado** (`tsc` acusa 3 erros) e o **fluxo de dados tem um bug funcional que impede o card de atualizar**. Upload também precisa de endurecimento antes de ir pra produção.

> Verificado com `npx tsc --noEmit` (3 erros) e `npm run lint` (2 warnings).

### ✅ Boas práticas (parabéns)

- **Server action `updateUserProfile`** — `auth()` + checagem `session.user.id !== id` é o instinto certo contra editar perfil de terceiros.
- **Modal controlado** (`isOpen`/`onClose`) — corrigiu o bug da segunda abertura apontado na review do PR #3. O `"use client"` e o `useState` interno saíram. Bem resolvido.
- **`Input`/`Label` reutilizáveis** — primitives corretos, agora com classes centralizadas.
- **Fluxo de dados melhorado** — `SideCardProfile` busca o usuário uma vez e repassa via props, matando a busca duplicada de dentro do `ProfileData`.
- **Fallbacks de imagem** restaurados (`?? "/bgsetup.jpg"`, `?? "/avatar.png"`) — o erro de `src={null}` sumiu.

### 🐛 Bugs (crítico — precisa corrigir)

**1. BUILD QUEBRADO — `tsc --noEmit` acusa 3 erros**
```ts
app/components/sidecard/FormEditProfile.tsx:15  TS2769  useFormState: FormState incompatível
app/components/sidecard/FormEditProfile.tsx:28  TS2345  setNewBackground(reader.result) — tipo
app/components/sidecard/FormEditProfile.tsx:38  TS2345  setNewAvatar(reader.result) — tipo
app/components/sidecard/FormEditProfile.tsx:101 TS2741  Avatar: prop 'ring' é obrigatória e não foi passada
```
- **TS2769**: o `useFormState` infere `type: string` do initialState e não casa com o literal `"success" | "error"` da `FormState`. Tipar o initialState (`const initialState: FormState = { message: "", type: "success" }`).
- **TS2345**: `useState(null)` infere `SetStateAction<null>`. Trocar por `useState<string | null>(null)`.
- **TS2741**: `ring` não é opcional em `AvatarProps`. Tornar opcional ou passar `ring={false}`.

**2. O card NÃO reflete a edição — bug funcional**
```ts
// app/lib/auth-user.ts
return session.user;   // só tem id, name, email, image
```
`getCurrentUser()` devolve os dados da **sessão criada no login** — `bio`, `title`, `location`, `background`, `stacks` **não existem na sessão**. Resultado: depois de salvar, o `ProfileData` continua renderizando fallbacks (`"Newbie"`, `"Earth"`, capa padrão) até o usuário fazer logout/login. O banco muda, a UI não.

> Fix: buscar no banco de dados:
> ```ts
> const user = await prisma.user.findUnique({ where: { id: session.user.id } });
> ```

**3. Upload inseguro — path traversal + nome não sanitizado**
```ts
const filePath = path.join(uploadDir, backgroundFile.name);
```
`backgroundFile.name` vem do cliente. `name = "../../evil"` **escapa da pasta `public/uploads`** via `path.join`. Além disso:
- sem validação de **MIME** (aceita qualquer arquivo) e **tamanho**;
- sem controle de **colisão** (dois uploads com mesmo nome sobrescrevem — dá pra ver isso nos commits: `a.jpg` e `blob`).

> Fix: `crypto.randomUUID()` como nome + extensão sanitizada, validar `file.type` e `file.size`, e usar o caminho como URL via `new URL(...).pathname`.

**4. Arquivos de teste commitados + sem `.gitignore`**
`public/uploads/a.jpg`, `public/uploads/blob` e `ImagePreview.tsx` (0 bytes) foram parar no PR. Remover e adicionar `public/uploads/` ao `.gitignore`.

**5. Upload em `public/` não sobrevive em produção**
Em Vercel/serverless o filesystem é **efêmero** — o que for gravado em `public/uploads` some entre deploys/instâncias. Para produção precisa de blob storage (Vercel Blob, S3, Cloudinary) ou ao menos deixar documentado que é só dev.

### 🐛 Falta de tratamento de erro

- `prisma.user.update` e `fs.writeFile` sem `try/catch` — qualquer falha estoura erro não tratado na action, sem feedback pro usuário. Retornar `{ message, type: "error" }`.
- Sem validação de formulário (ex.: nome vazio, bio gigante) — um `zod` resolveria.

### 🧹 Refatorações recomendadas

- **Upload duplicado** — dois blocos idênticos (background e image). Extrair helper:
  ```ts
  async function saveFile(file: File): Promise<string | undefined> {
    if (!file || file.size === 0) return undefined;
    // validação + uuid + write
    return `/uploads/${name}`;
  }
  ```
- **`formState` não usado** na action → renomear pra `_formState` (o lint já reclama de unused vars).
- **Imports desorganizados** em `actions.ts` — `type FormState` e `import path` no meio do arquivo. Importa tudo no topo.
- **Hidden input `id` desnecessário** — você já tem o `session.user.id`; compare direto e elimine o campo do form (menos superfície de erro).
- **`getUserByEmail` virou código morto** — remover (ou usar na correção do item 2).
- **Div vazia** `<div className="flex gap-2 mt-2"></div>` no `ProfileData` — mesma pendência do PR #3, ainda não resolvida.
- **`useFormState` está deprecado no React 19** — usar `useActionState`.
- **Sem estado de loading no submit** — o botão "Salvar" permite duplo envio. Desabilitar enquanto processa.
- **`ImagePreview.tsx` vazio** — implementar ou deletar.
- **Migração `test_edit`** — renomear pra `add_bio_on_user`.

### 🧹 Detalhes menores

- `next/image` com `data:` URL (preview do `FileReader`) — **validar**: pode exigir `unoptimized` ou quebrar em produção.
- `z-100`, `h-19`, `max-w-125`, `bg-black/78` funcionam no **Tailwind v4** (valores dinâmicos) — a dúvida do PR anterior ficou resolvida. Só considerar `z-[100]` pra deixar intencional.
- `lint`: 2 warnings (`_formData` em `actions.ts`, import `NextAuth` não usado em `next-auth.d.ts`).

---

**Veredito:** a feature está quase lá e a direção é a certa, mas **não pode ir pra `main` assim**: o build quebra no typecheck, o card não atualiza após salvar (item 2) e o upload tem falha de segurança (item 3). Corrige os 3 erros de TS, faz o `getCurrentUser` buscar do banco e endurece o upload — depois disso tá pronto pro merge.

### Rafael-Machado01 — 2026-08-15
Adicionado a issue, o problema com uploads.
