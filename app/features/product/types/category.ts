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

export interface CategoryTree {
  active: boolean
  children: CategoryTree[]
  createdAt: Date
  description: Description
  id: string
  imageUrl: string
  name: string
  slug: string
  updatedAt: Date
}

export interface Description {
  type: string
  content: DescriptionContent[]
}
export interface DescriptionContent {
  type: string
  content: ContentContent[]
}

export interface ContentContent {
  text: string
  type: string
}
