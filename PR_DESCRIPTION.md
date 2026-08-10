# PR: Modal add

## Resumo

Refatoração da estrutura de componentes do sidecard + novo modal de edição de perfil, com novos campos de dados do usuário e melhorias visuais (glow).

## O que mudou

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

## Arquivos alterados

```
 app/components/{ui => }/NavBar.tsx                 |  7 ++--
 app/components/sidecard/EditProfile.tsx            | 22 +++++++++++
 app/components/{SideCardProfile => sidecard/ProfileData}.tsx | 27 ++++++++-----
 app/components/{ui => sidecard}/SideCard.tsx       |  4 +-
 app/components/{ => sidecard}/SideCardLoginButtons.tsx | 10 +++--
 app/components/sidecard/SideCardProfile.tsx        | 12 ++++++
 app/components/svg/LocationIcon.tsx                | 14 +++++++
 app/components/svg/Logo.tsx                        |  4 +-
 app/components/ui/Avatar.tsx                       |  2 +-
 app/components/ui/Button.tsx                       |  3 +-
 app/components/ui/Card.tsx                         |  2 +-
 app/components/ui/Modal.tsx                        | 45 ++++++++++++++++++++++
 app/constants/tailwindData.ts                      |  3 +-
 app/globals.css                                    | 21 ++++++++++
 app/page.tsx                                       |  5 ++-
 app/types/User.ts                                  | 25 ++++++------
 prisma/migrations/20260809213039_add_infosprofiles/migration.sql |  4 ++
 prisma/schema.prisma                               |  2 +
 18 files changed, 176 insertions(+), 36 deletions(-)
```

## Ponto de atenção

`app/page.tsx` importa `Modal` mas ainda não o renderiza — a integração da feature está em andamento.

## Checklist

- [ ] Revisar pontos de atenção
- [ ] Testar fluxo de edição de perfil
