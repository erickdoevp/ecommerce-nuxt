export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  active: boolean
  createdAt: string
  updatedAt: string
  parent?: Parent
  children?: Category[]
}

interface Parent {
  id: string
  name: string
  slug: string
}

export interface CategoryOption {
  label: string
  value: string
  depth: number
  isParent: boolean
}
