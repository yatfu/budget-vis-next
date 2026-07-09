this is the design system for AI to consistently style throughout app

## Colors
- Use semantic tokens, not raw Tailwind colors: bg-background, text-foreground, border-border, text-muted-foreground
- Background layers: bg-background (page) → bg-card (rows/containers) → border-border (borders)
- Danger: text-destructive, hover:bg-destructive/10

## Spacing
- Row padding: px-1 py-1
- Gap between inline elements: gap-1
- Border radius: rounded-lg (containers), rounded-md (inputs/buttons)

## Components
- Inputs: bg-zinc-950, border-zinc-800, focus:border-zinc-600, [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
- Buttons: shadcn Button, variant="ghost" for icon-only actions, variant="secondary" for inline actions