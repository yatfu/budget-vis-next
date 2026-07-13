this is the design system for AI to consistently style throughout app

## Colors
- Use semantic tokens, not raw Tailwind colors: bg-background, text-foreground, border-border, text-muted-foreground
- Background layers: bg-background (page) → bg-card (rows/containers) → border-border (borders)
- Danger: text-destructive, hover:bg-destructive/10

## Spacing
- Row padding: px-1 py-1
- Gap between inline elements: gap-1
- Border radius: rounded-lg (containers), rounded-md (inputs/buttons)

## Shared style constants (lib/utils.ts)
shadcn was removed from this project — components are plain HTML styled with Tailwind. To keep every container/input/button consistent, reuse these constants instead of writing the classes inline:
- `cardStyles` — rounded-lg bordered container (rows, cards, form panels): `rounded-lg border border-border bg-card px-1 py-1`
- `inputStyles` — text/number/select inputs: bg-zinc-950, border-border (same border color as cardStyles), focus:border-zinc-600, rounded-md, spinner arrows removed
- `buttonBase` + `buttonVariants.{default,secondary,ghost}` + `buttonSizes.{default,sm,icon}` — compose with `cn()`, e.g. `cn(buttonBase, buttonVariants.secondary, buttonSizes.sm)`. `buttonBase` includes `border border-border` so buttons carry the same border as `cardStyles`/`inputStyles`
  - variant="ghost" for icon-only actions
  - variant="secondary" for inline actions
  - variant="default" for the primary/submit action in a form
- `borderless` — appends `border-transparent` to hide the border on a `cardStyles`/`inputStyles`/`buttonBase` element while keeping its border width/radius (no layout shift). Used for elements that should sit flush with their surroundings instead of looking like their own bordered box:
  - the `X` delete icon button in `ExpenseRow`
  - all navbar elements in `Nav` (Dashboard/History/Login/Register links, Log Out button)

## Components
- Any new rounded-border container (card, row, form panel) should use `cardStyles`, not a hand-written rounded-lg/border-border/bg-card string
- Any new input or select should use `inputStyles`
- Any new button/button-like link should use `buttonBase` + a `buttonVariants` entry + a `buttonSizes` entry
- If a button/input/container shouldn't show a border (e.g. it sits inline in a toolbar/navbar rather than as its own box), append `borderless` instead of omitting the border classes by hand