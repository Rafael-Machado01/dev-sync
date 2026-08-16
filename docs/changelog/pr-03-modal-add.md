# PR #3 — modal add

- **Status:** merged
- **Merged em:** 2026-08-10
- **Link:** https://github.com/Rafael-Machado01/dev-sync/pull/3

## Resumo

Refatoração da estrutura de componentes do sidecard + novo modal de edição de perfil, com novos campos de dados do usuário e melhorias visuais (glow).

## O que mudou - revisado com opencode

### Nova estrutura de pastas (`app/components/`)

- `ui/NavBar.tsx` → movido para `app/components/NavBar.tsx`
- `SideCardProfile.tsx` → dividido em `sidecard/ProfileData.tsx` (dados) e novo `sidecard/SideCardProfile.tsx` (composição)
- `SideCardLoginButtons.tsx` e `SideCard.tsx` → movidos para `sidecard/`
- Importações corrigidas: `@/app/components/Button` → `@/app/components/ui/Button`

### Nova feature: Edição de perfil

- **`ui/Modal.tsx`** — componente reutilizável de modal (backdrop com blur, scroll interno, fechar por overlay ou botão)
- **`sidecard/EditProfile.tsx`** — botão "[ EDITAR PERFIL ]" que abre o modal
- **`svg/LocationIcon.tsx`** — novo ícone de localização

### Dados do usuário (Prisma)

- Migração `add_infosprofiles`: novas colunas `title`, `stacks` (string[]) e `background` no modelo `User`
- `ProfileData` agora usa `user?.background` como capa (em vez de imagem estática) e exibe localização ("São Paulo BR")

### Visual

- Novas utilities de glow em `globals.css`:
  - `shadow-glow-purple`
  - `shadow-glow-purple-lg`
  - `shadow-glow-cyan`
  - `shadow-glow-red`
- `Card` agora tem borda + `shadow-glow-purple-lg`; Avatar usa `shadow-glow-purple`
- Nova constante `tailwindData.centered` para centralização (NavBar, Logo, Button)
- Botão de login com `shadow-2xl`

---

## Comentários

### Rafael-Machado01 — 2026-08-10
opencode refatorando

# Revisão — PR: Modal add

Review geral: a **refatoração tá muito boa**, a parte de **bugs/lixo precisa de atenção**.

### ✅ Boas práticas (parabéns)

- **Quebra do `SideCardProfile` em `ProfileData` + `EditProfile`** — composição via `children`, separando responsabilidade de dados e interação. Ficou limpo e reutilizável.
- **Organização de pastas** — `sidecard/` agrupando os componentes relacionados. Corrigiu imports quebrados (`Button`). Estrutura ficou muito mais legível.
- **`Modal.tsx` reutilizável** — ter o modal desacoplado (backdrop, scroll, título) é a abordagem certa.
- **Constantes `tailwindData`** — centralizar strings de classe evita repetição. Boa.
- **Utilities de glow no `globals.css`** — tirar o `shadow-[0_0_...]` inline e virar tokens (`shadow-glow-purple`, etc.) é design system de verdade.
- **Migração Prisma** — migração + tipo `User.ts` atualizados juntos. Correto.

### 🐛 Bugs (lixo de dev — precisa corrigir)

**1. Dupla gestão de estado no modal — `EditProfile.tsx` + `Modal.tsx`**
```tsx
// EditProfile.tsx
const [state, setState] = useState(false);      // estado 1
{state ? <Modal title="Edit Profile">a</Modal> : ""}

// Modal.tsx
const [state, setState] = useState(true);        // estado 2 — sempre true
const handleClickClose = () => setState(false);
```
Dois estados controlando a mesma coisa. Pior: quando o usuário fecha o modal pelo `✕` ou pelo backdrop, o `state` do `EditProfile` **continua `true`** — ao clicar em "EDITAR PERFIL" de novo, o `!state` **fecha** em vez de abrir. **O modal não abre a segunda vez.**

> Fix: `Modal` deveria ser **controlado** pelo pai via `isOpen`/`onClose`. A prop `isOpen` já está na interface mas **nem é usada** — lixo morto.

**2. `Image` sem fallback — `ProfileData.tsx`**
```tsx
src={user?.background}
```
`background` é `String?` no schema. Se o usuário não tem capa, vira `src={null}` → **erro de runtime no `next/image`**. Tinha uma imagem estática (`/bgsetup.jpg`) como fallback e foi jogada fora junto. Precisa de `src={user?.background ?? "/bgsetup.jpg"}`.

**3. Import sem uso — `Logo.tsx`**
```tsx
import { tailwindData } from "@/app/constants/tailwindData";
```
Importado e **nunca usado**. Lixo.

**4. Import morto — `page.tsx`**
```tsx
import Modal from "./components/ui/Modal";
```
`Modal` importado e **nem renderizado**. Se não está integrado, não comite junto com o PR.

**5. Props mortas — `Modal.tsx`**
```tsx
interface ModalProps {
  className?: string;
  isOpen?: boolean;   // declarada e nunca usada
  ...
}
```

**6. Lixo de JSX — `ProfileData.tsx`**
```tsx
<div className="flex gap-2 mt-2"></div>
```
Div **vazia**. Ou vai receber as stacks (que já existem no schema!) ou sai.

### 🧹 Detalhes menores

- `SideCardLoginButtons.tsx`: espaço duplicado no className (`justify-center  items-center`).
- `EditProfile.tsx`: conteúdo do modal é literalmente `"a"` — placeholder esquecido.
- `Modal.tsx`: `z-100` não é um valor padrão de z-index no Tailwind — confirmar se compila.

### Rafael-Machado01 — 2026-08-10
**❌ Bloqueador**
1. `location` sem migração — `schema.prisma:16` e `User.ts` ganharam `location`, mas a única migração (`20260809213039_add_infosprofiles`) só tem `background`/`stacks`/`title`. Banco e schema estão dessincronizados — `prisma migrate deploy` falha em ambiente limpo. Falta `prisma migrate dev --name add_location`.

**🧹 Lixo que sobrou (a maioria apontada na review anterior, ainda aberta)**
2. `Modal.tsx:2` — `useState` importado e não usado (ficou órfão após virar controlado).
3. `ProfileData.tsx:60` — `<div className="flex gap-2 mt-2"></div>` vazia continua. Ela é o lugar natural das stacks (que já existem no schema e nunca são renderizadas).
4. `page.tsx:4` — import `Modal` morto, nunca renderizado.
5. `EditProfile.tsx:20` — conteúdo do modal ainda é o placeholder `"a"`.
