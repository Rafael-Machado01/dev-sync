# Revisão — PR: Modal add

Review geral: a **refatoração tá muito boa**, a parte de **bugs/lixo precisa de atenção**.

---

## ✅ Boas práticas (parabéns)

- **Quebra do `SideCardProfile` em `ProfileData` + `EditProfile`** — composição via `children`, separando responsabilidade de dados e interação. Ficou limpo e reutilizável.
- **Organização de pastas** — `sidecard/` agrupando os componentes relacionados. Corrigiu imports quebrados (`Button`). Estrutura ficou muito mais legível.
- **`Modal.tsx` reutilizável** — ter o modal desacoplado (backdrop, scroll, título) é a abordagem certa.
- **Constantes `tailwindData`** — centralizar strings de classe evita repetição. Boa.
- **Utilities de glow no `globals.css`** — tirar o `shadow-[0_0_...]` inline e virar tokens (`shadow-glow-purple`, etc.) é design system de verdade.
- **Migração Prisma** — migração + tipo `User.ts` atualizados juntos. Correto.

---

## 🐛 Bugs (lixo de dev — precisa corrigir)

### 1. Dupla gestão de estado no modal — `EditProfile.tsx` + `Modal.tsx`
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

### 2. `Image` sem fallback — `ProfileData.tsx`
```tsx
src={user?.background}
```
`background` é `String?` no schema. Se o usuário não tem capa, vira `src={null}` → **erro de runtime no `next/image`**. Tinha uma imagem estática (`/bgsetup.jpg`) como fallback e foi jogada fora junto. Precisa de `src={user?.background ?? "/bgsetup.jpg"}`.

### 3. Import sem uso — `Logo.tsx`
```tsx
import { tailwindData } from "@/app/constants/tailwindData";
```
Importado e **nunca usado**. Lixo.

### 4. Import morto — `page.tsx`
```tsx
import Modal from "./components/ui/Modal";
```
`Modal` importado e **nem renderizado**. Se não está integrado, não comite junto com o PR.

### 5. Props mortas — `Modal.tsx`
```tsx
interface ModalProps {
  className?: string;
  isOpen?: boolean;   // declarada e nunca usada
  ...
}
```

### 6. Lixo de JSX — `ProfileData.tsx`
```tsx
<div className="flex gap-2 mt-2"></div>
```
Div **vazia**. Ou vai receber as stacks (que já existem no schema!) ou sai.

---

## 🧹 Detalhes menores

- `SideCardLoginButtons.tsx`: espaço duplicado no className (`justify-center  items-center`).
- `EditProfile.tsx`: conteúdo do modal é literalmente `"a"` — placeholder esquecido.
- `Modal.tsx`: `z-100` não é um valor padrão de z-index no Tailwind — confirmar se compila.

---

**Veredito:** a direção de refatoração é excelente e merece seguir. Mas o modal **quebrado na segunda abertura**, a falta de fallback na `Image` e os imports/JSX mortos não podem ir pra `main` assim. Corrige o estado do modal e o fallback que tá pronto pra merge.
