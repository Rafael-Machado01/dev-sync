# Arquitetura: Auth centralizada no page.tsx

## Situação atual

Hoje cada componente chama `getCurrentUser()` independentemente:
- `SideCard.tsx:7` — chama `getCurrentUser()`
- `Posts.tsx:8` — chama `getCurrentUser()` de novo

Isso resulta em **chamadas redundantes** à sessão.

## Proposta

Centralizar a lógica de auth no `page.tsx` e passar via props. Isso é uma boa abordagem porque:

1. **Única chamada de sessão** — evita queries duplicadas
2. **Fluxo de dados claro** — page é a "fonte da verdade"
3. **Componentes mais testáveis** — recebem props, não dependem de `getCurrentUser()` internamente

## Arquitetura

```
page.tsx (server)
├── getCurrentUser() → user | null
├── getAllPosts() → posts[]
│
├── SideCard (user={user})
│   ├── se user → ProfileData
│   └── se null → LoginButtons
│
├── Posts (user={user}, posts={posts})
│   ├── NewPost (se logado)
│   └── Post[] (feed)
│
└── Stats (user={user}, posts={posts})  ← novo componente
    ├── se logado → stats do usuário (posts, likes recebidos)
    └── se null → info genérica / CTA
```

## page.tsx resultante

```tsx
export default async function Home() {
  const user = await getCurrentUser();
  const posts = await getAllPosts();

  return (
    <div>
      <NavBar user={user} />
      <div className={tailwindData.gridLayoutSync}>
        <aside className={tailwindData.gridLayoutLeftSide}>
          <SideCard user={user} />
        </aside>
        <main className={tailwindData.gridLayoutMain}>
          <Posts user={user} posts={posts} />
        </main>
        <aside className={tailwindData.gridLayoutRightSide}>
          <Stats user={user} posts={posts} />
        </aside>
      </div>
    </div>
  );
}
```

Cada componente receberia `user` (ou `null`) e decidiria o que renderizar.
