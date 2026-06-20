export interface MegaLink {
  label: string
  to: string
}

export interface MegaColumn {
  title: string
  links: MegaLink[]
}

export interface NavItem {
  label: string
  to: string
  mega?: {
    columns: MegaColumn[]
    featured: { eyebrow: string, title: string, cta: string, to: string, gradient: string }
  }
}
