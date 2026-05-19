import { z } from 'zod'
import { extractText } from '../utils/extract-text'

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  slug: z.string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones (ej. mi-producto)'),
  description: z.any().refine(
    val => extractText(val).trim().length > 0,
    'La descripción es requerida'
  ),
  basePrice: z.coerce
    .number({ error: 'Ingresa un precio válido' })
    .positive('El precio debe ser mayor a 0'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']),
})

export type ProductSchema = z.infer<typeof productSchema>
