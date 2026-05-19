export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  active: boolean
  children?: Category[]
  createdAt: string
  updatedAt: string
  parent?: null
}

export interface CategoryOption {
  label: string
  value: string
  depth: number
  isParent: boolean
}
