import { z } from 'zod'
import { extractText } from '~/features/product/utils/extract-text'

export const collectionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  slug: z.string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones (ej. verano-2025)'),
  description: z.any().refine(
    val => extractText(val).trim().length > 0,
    'La descripción es requerida'
  ),
  active: z.boolean(),
  position: z.number({ error: 'Ingresa un número válido' }).int().min(1, 'La posición debe ser mayor a 0')
})

export type CollectionSchema = z.infer<typeof collectionSchema>
