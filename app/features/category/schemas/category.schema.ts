import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  slug: z.string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones (ej. mi-categoria)'),
  description: z.any().optional(),
  parentId: z.string().optional(),
  active: z.boolean().default(true),
})

export type CategorySchema = z.infer<typeof categorySchema>
