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

_(nenhum review ainda)_
