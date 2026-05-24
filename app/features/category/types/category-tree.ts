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
