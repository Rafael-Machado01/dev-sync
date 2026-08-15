# PR: Edição de perfil funcional

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

### Dados do usuário (Prisma)
- Novo campo `bio` no modelo `User` (migração `20260814202435_test_edit`), refletido em `app/types/User.ts`
- Migração `20260810222926_add_location_on_user` (campo `location`)

### Componentização (novos primitives em `ui/`)
- **`ui/Input.tsx`** — input estilizado reutilizável (foco com borda roxa)
- **`ui/Label.tsx`** — label padronizado
- **`ui/ImagePreview.tsx`** — placeholder criado para preview de imagem (ver ponto de atenção)

### Correções da review do PR #3
- `Modal.tsx` agora é **controlado** pelo pai (`isOpen`/`onClose`), removidos `useState` interno e `"use client"` que quebravam a segunda abertura
- `ProfileData` restaura fallback de imagem (prévia de capa/avatar com `??` em vez de `src={null}`)
- Removidos imports mortos (`page.tsx` deixa de importar `Modal` sem usar)

## Arquivos alterados

```
 app/actions.ts                                        | 69 ++++++++++++++++++-
 app/components/sidecard/EditProfile.tsx               |  6 +-
 app/components/sidecard/FormEditProfile.tsx           | 155 ++++++++++++++++++++++++
 app/components/sidecard/ProfileData.tsx               | 19 +++----
 app/components/sidecard/SideCardProfile.tsx           |  8 +-
 app/components/ui/ImagePreview.tsx                    |  0
 app/components/ui/Input.tsx                           | 15 ++++++++++
 app/components/ui/Label.tsx                           | 15 ++++++++++
 app/components/ui/Modal.tsx                           |  3 --
 app/page.tsx                                          |  1 -
 app/types/User.ts                                     |  1 +
 prisma/migrations/20260810222926_add_location_on_user/migration.sql | 2 +
 prisma/migrations/20260814202435_test_edit/migration.sql            | 2 +
 prisma/schema.prisma                                 |  1 +
 public/avatar.png                                    | Bin 0 -> 1582 bytes
 public/uploads/a.jpg                                 | Bin 0 -> 150262 bytes
 public/uploads/blob                                  |  0
 17 files changed, 279 insertions(+), 18 deletions(-)
```

## Pontos de atenção

- `ui/ImagePreview.tsx` está **vazio** (0 bytes) — placeholder aguardando implementação ou deve ser removido
- `public/uploads/a.jpg` e `public/uploads/blob` parecem **arquivos de teste** de upload — avaliar se entram no PR
- Upload não sanitiza nome de arquivo nem valida tipo/tamanho — ok para dev, mas necessário tratar antes de produção
- `migration.sql` nomeada `test_edit` deveria ser renomeada (ex.: `add_bio_on_user`) antes de merge

## Checklist

- [ ] Revisar pontos de atenção
- [ ] Testar upload de capa/avatar e edição dos campos
- [ ] Confirmar comportamento da segunda abertura do modal
