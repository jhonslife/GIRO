# 🎨 Roadmap: Design Agent

> **Agente:** Design / UI-UX  
> **Responsabilidade:** Design System, Tokens, Protótipos, Acessibilidade  
> **Status:** ✅ Concluído
> **Progresso:** 20/20 tasks (100%)
> **Sprint:** 1-2
> **Bloqueado Por:** -

---

## 📋 Checklist de Tasks

### 1. Design System Foundation (Sprint 1) ✅

- [x] **DESIGN-001**: Definir paleta de cores (Primary, Secondary, Neutral, Semantic)
- [x] **DESIGN-002**: Definir tipografia (Font family, sizes, weights)
- [x] **DESIGN-003**: Definir espaçamentos (4px grid system)
- [x] **DESIGN-004**: Definir sombras e elevações
- [x] **DESIGN-005**: Definir border-radius padrões
- [x] **DESIGN-006**: Criar design tokens em JSON/CSS variables

### 2. Customização Shadcn/UI (Sprint 1) ✅

- [x] **DESIGN-007**: Customizar tema do Shadcn para Mercearias
- [x] **DESIGN-008**: Criar variantes de Button (primary, secondary, danger, ghost)
- [x] **DESIGN-009**: Criar componente de Input com ícones e estados
- [x] **DESIGN-010**: Criar componente de Card com variantes
- [x] **DESIGN-011**: Criar componente de Badge para status
- [x] **DESIGN-012**: Criar componente de Alert/Toast

### 3. Componentes Específicos (Sprint 2) ✅

- [x] **DESIGN-013**: Criar componente ProductCard
- [x] **DESIGN-014**: Criar componente NumPad (teclado numérico)
- [x] **DESIGN-015**: Criar componente de KeyboardShortcut display
- [x] **DESIGN-016**: Criar componente de SaleReceipt (preview de cupom)

### 4. Protótipos de Telas (Sprint 1-2) ✅

- [x] **DESIGN-017**: Protótipo da tela de PDV (Figma ou similar)
- [x] **DESIGN-018**: Protótipo do dashboard de relatórios
- [x] **DESIGN-019**: Protótipo da tela de produtos

### 5. Acessibilidade (Sprint 2) ✅

- [x] **DESIGN-020**: Garantir contraste WCAG 2.1 AA em todas as cores

---

## 📊 Métricas de Qualidade

| Métrica                  | Target  | Atual |
| ------------------------ | ------- | ----- |
| Cores com contraste AA   | 100%    | 0%    |
| Componentes documentados | 100%    | 0%    |
| Tokens exportados        | Sim     | Não   |
| Protótipos aprovados     | 3 telas | 0     |

---

## 🔗 Dependências

### Depende de
- Nenhum (pode iniciar imediatamente)

### Bloqueia
- 🎨 Frontend (precisa de tokens e componentes)

---

## 📝 Notas Técnicas

### Paleta de Cores Proposta

```css
/* Cores Primárias - Tema "Mercearia Brasileira" */
:root {
  /* Verde Mercado */
  --color-primary-50: #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e; /* Principal */
  --color-primary-600: #16a34a;
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;

  /* Laranja Tropical (Accent) */
  --color-accent-50: #fff7ed;
  --color-accent-100: #ffedd5;
  --color-accent-200: #fed7aa;
  --color-accent-300: #fdba74;
  --color-accent-400: #fb923c;
  --color-accent-500: #f97316; /* Accent */
  --color-accent-600: #ea580c;
  --color-accent-700: #c2410c;

  /* Neutros */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;

  /* Semânticas */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```text
### Tipografia

```css
:root {
  /* Font Family */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px - Preço grande no PDV */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```text
### Espaçamentos (4px Grid)

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
}
```text
### Shadcn Theme Override

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... customizado para verde mercado
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        mono: ['JetBrains Mono', ...fontFamily.mono],
      },
      fontSize: {
        price: ['2.25rem', { lineHeight: '1', fontWeight: '700' }],
        'price-lg': ['3rem', { lineHeight: '1', fontWeight: '700' }],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```text
### Componentes Específicos - ProductCard

```tsx
// Especificação visual do ProductCard

interface ProductCardProps {
  product: Product;
  variant: 'compact' | 'detailed';
  showStock?: boolean;
  onSelect?: () => void;
}

/**
 * Variante Compact (para PDV grid):
 * ┌────────────────────┐
 * │  [Imagem/Ícone]    │
 * │  Nome Produto      │
 * │  R$ 5,99           │
 * │  ████████░░ 80%    │  <- barra de estoque
 * └────────────────────┘
 *
 * Variante Detailed (para listagem):
 * ┌─────────────────────────────────────────┐
 * │ [Img] │ Nome do Produto Completo       │
 * │       │ Código: 7891234567890           │
 * │       │ Estoque: 45 un | Custo: R$3,50 │
 * │       │ Venda: R$ 5,99    [Editar] [X] │
 * └─────────────────────────────────────────┘
 */
```text
### NumPad Component

```text
┌─────────────────────────┐
│    QUANTIDADE / PREÇO   │
│    ┌───────────────┐    │
│    │     123.45    │    │
│    └───────────────┘    │
│                         │
│   ┌───┐ ┌───┐ ┌───┐    │
│   │ 7 │ │ 8 │ │ 9 │    │
│   └───┘ └───┘ └───┘    │
│   ┌───┐ ┌───┐ ┌───┐    │
│   │ 4 │ │ 5 │ │ 6 │    │
│   └───┘ └───┘ └───┘    │
│   ┌───┐ ┌───┐ ┌───┐    │
│   │ 1 │ │ 2 │ │ 3 │    │
│   └───┘ └───┘ └───┘    │
│   ┌───┐ ┌───┐ ┌───┐    │
│   │ 0 │ │ . │ │ ⌫ │    │
│   └───┘ └───┘ └───┘    │
│   ┌─────────────────┐   │
│   │    CONFIRMAR    │   │
│   └─────────────────┘   │
└─────────────────────────┘
```text
---

## 🧪 Critérios de Aceite

### Tokens

- [ ] Todas as cores exportadas como CSS variables
- [ ] Tipografia consistente em todo o app
- [ ] Grid de 4px respeitado

### Componentes

- [ ] Shadcn customizado com tema verde
- [ ] Todos os estados (hover, focus, disabled) definidos
- [ ] Dark mode funcional (opcional v1)

### Acessibilidade

- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande
- [ ] Focus visible em todos os elementos interativos
- [ ] Suporte a navegação por teclado

---

## 🎨 Referências Visuais

### Inspirações

- Toast POS (simplicidade e foco)
- Shopify POS (design moderno)
- Square (UX fluida)

### Diretrizes

- Alto contraste para uso em ambientes com iluminação variada
- Botões grandes (mínimo 44x44px) para touch
- Feedback visual imediato (animações sutis)
- Preços sempre em destaque (fonte grande, bold)

---

_Roadmap do Agente Design - Arkheion Corp_