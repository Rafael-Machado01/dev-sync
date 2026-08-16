# Changelog

Todas as mudanças notáveis do projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [Não publicado]

### Adicionado

- **Criação de posts** (PR #7 — *Featature newPost*):
  - `NewPost.tsx`: formulário de criação de post com legenda (5–225 caracteres), preview de imagem e botão "Publicar".
  - `Posts.tsx`: componente servidor que busca o usuário logado e renderiza o formulário.
  - Server action `newPost` com validação de sessão, upload de imagem e `revalidatePath("/")`.
  - `Post.imageUrl` agora é opcional no schema Prisma (`String?`), permitindo posts só com legenda.
  - Componentes de UI: `TextArea` (novo), preview de imagem em `ImagePreview`, `Input`/`Label` com classes centralizadas em `tailwindData`.

## [0.2.0] - 2026-08-15

### Adicionado

- **Edição de perfil funcional** (PR #4):
  - Server action `updateUserProfile` com validação de sessão e autorização.
  - `FormEditProfile.tsx`: formulário com preview de capa/avatar via `FileReader`, campos Nome/Cargo/Bio/Localização.
  - `EditProfile` integrado ao modal, repassando `user` via props.
  - `SideCardProfile` busca o usuário uma vez e repassa via props.

### Corrigido

- `Modal` agora é controlado pelo pai (`isOpen`/`onClose`), corrigindo o bug da segunda abertura.
- Fallbacks de imagem restaurados (`?? "/bgsetup.jpg"`, `?? "/avatar.png"`).
- Imports mortos removidos.

## [0.1.0] - 2026-08-08

### Adicionado

- **Estruturação do projeto** (PR #1):
  - Tipos em `app/types/`, constantes de tailwind em `tailwindData`, botão reutilizável `Button`.
  - `NavBar` fixo com logo SVG; `SideCard` de login com "Entrar com Google/GitHub".
  - Integração do Prisma Adapter ao NextAuth e action `signInWithProvider`.
  - Funcionalidade de logout (action `logout` + botão LOGOUT na NavBar).

- **Avatar Card Perfil** (PR #2):
  - Componentes `Avatar`, `Card` e `SideCardProfile` (capa, avatar, cargo, botão editar).
  - Helper `getCurrentUser()`.
  - Layout de grid 3 colunas em `page.tsx`.
  - Campo `title` no modelo `User`.

- **Modal add** (PR #3):
  - Componente reutilizável `Modal`.
  - Refatoração: `sidecard/ProfileData` + `sidecard/SideCardProfile` (composição).
  - Novos campos `title`, `stacks` e `background` no modelo `User`.
  - Utilities de glow no `globals.css` (`shadow-glow-purple`, `shadow-glow-cyan`, etc.).

### Corrigido

- `height-[62px]` (classe inválida) → `h-15.5` na NavBar.
- `@keyframes float` definido em `globals.css` para a animação da logo.
- `console.log` de debug removidos.
- Formulários duplicados de login substituídos por `.map()` sobre `login-providers.ts`.
- `getUserByEmail`: `findFirst` → `findUnique`.

## Notas

Os arquivos por PR (com comentários de review) ficam em `docs/changelog/`.
