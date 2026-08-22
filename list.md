# Dev Sync — Features & Técnicas (do simples ao complexo)

> Notas de estudo: cada item é uma lógica/técnica usada no projeto para revisitar depois.

## 1. Fundamentos de UI — componentes reutilizáveis

- [ x] Botão reutilizável estendendo props nativas (`ButtonHTMLAttributes`) + slot de ícone + className injetada
- [x ] Input e TextArea reutilizáveis com spread de props (`ComponentProps`) e classe padrão centralizada
- [x ] Card reutilizável com composição via `children`
- [ x] Prop booleana opcional modificando estilo (hover glow)
- [x ] Divisória (Line) com gradiente linear
- [ x] Avatar circular: tamanho dinâmico via style inline + anel (ring) opcional sobreposto
- [ x] Ícones SVG encapsulados como componentes React dedicados
- [ ] Design tokens: constantes centralizadas de classes Tailwind (tailwindData)
- [ ] Renderização data-driven: array de objetos (nome + provider + ícone) mapeado gerando os botões de login
- [x] Renderização condicional: ternário, `&&`, early return `null`

## 2. Interações client-side (estado)

- [ ] Modal genérico: `isOpen`/`onClose`, early return quando fechado
- [ ] Fechar modal clicando no backdrop + `stopPropagation` no conteúdo interno
- [ ] Toggle booleano para abrir/fechar modal
- [ ] Popup/toast temporário: `setTimeout` no useEffect + cleanup do timer
- [ x] Preview de imagem antes do upload: `FileReader.readAsDataURL`
- [ ] Remover imagem selecionada do preview
- [ ] Input file invisível dentro de label clicável (hack de CSS)
- [x ] Gerador de ID decorativo: `crypto.randomUUID` + replaceAll + slice + uppercase 
- [ ] Desabilitar/habilitar botão conforme contagem de caracteres (>= 5)

## 3. Autenticação (Auth.js v5 + OAuth)

- [ ] Setup NextAuth com providers GitHub e Google
- [ ] PrismaAdapter persistindo User, Account, Session e VerificationToken
- [ ] Route handler catch-all `/api/auth/[...nextauth]`
- [ ] signIn/signOut disparados via Server Actions dentro de `<form>`
- [ ] `.bind(null, argumento)` para passar parâmetro fixo a uma action usada em form
- [ ] Helper getCurrentUser: sessão → validação de id → busca no banco
- [ ] Type augmentation: sobrescrever interface Session do next-auth (declare module)
- [ ] UI condicional por estado de auth (botão logout aparece só logado)
- [ ] SideCard que troca entre tela de login e card de perfil conforme sessão

## 4. Banco de dados (Prisma)

- [ ] Instância única do PrismaClient com driver adapter (PrismaPg + DATABASE_URL)
- [ ] Modelagem relacional: User → Posts → Likes/Comments (1:N)
- [ ] `onDelete: Cascade` em todas as foreign keys
- [ ] Constraint composta: `@@unique([provider, providerAccountId])` na Account
- [ ] Interfaces TypeScript próprias espelhando os models (tipagem manual)
- [ ] Query do feed: `include` aninhado (post → user, likes, comments → user) + `orderBy` desc
- [ ] Query dos posts do usuário: `where` + include + ordenação por createdAt
- [ ] Buscas pontuais com `findUnique` (por email e por id)

## 5. Server Actions & mutações

- [ ] Contrato de retorno padrão: FormState `{ message, type: success | error }`
- [ ] `useActionState` conectando form HTML à action assíncrona + estado inicial tipado
- [ ] useEffect reagindo ao sucesso da action para resetar o form (incremento de key força remount)
- [ ] Validação server-side manual dos campos (tamanhos mínimos)
- [ ] Autorização: comparar `session.user.id` com o id recebido (proteção anti-IDOR)
- [ ] Guard clauses / early returns para usuário não autenticado
- [ ] Upload de arquivo no servidor: File do FormData → arrayBuffer → Buffer → `fs.writeFile` em public/uploads (+ mkdir recursive)
- [ ] Montar objeto de update parcial com spread condicional (só inclui campo se existir)
- [ ] Hidden input carregando o userId no formulário
- [ ] `revalidatePath("/")` invalidando cache após toda mutação
- [ ] Server Component assíncrono buscando dados direto do banco (page.tsx, MyPosts)
- [ ] Composição com children: ProfileData recebendo EditProfile como filho

## 6. Algoritmos de negócio

- [ ] Like/unlike (toggle): `findFirst` → se existe registro, delete; senão, create
- [ ] Contador otimista de likes no cliente: flip do boolean liked + incremento/decremento local do count
- [ ] Derivar isLiked do estado do servidor: `some()` nos likes comparando userId
- [ ] Bloquear like sem login: popup de erro em vez da ação
- [ ] Criar comentário usando userId sempre da session (nunca confiar no client)
- [ ] Validar comentário vazio com trim antes de enviar
- [ ] Deletar post somente se o dono (checar ownership antes do delete)
- [ ] Reset do textarea e feedback de sucesso após comentar
