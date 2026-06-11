<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useFileDialog } from '@vueuse/core'
import type { SelectOption } from '~/components/types/select'
import type { VariantEditable, VariantGridRow } from '../types/product-variant'
import AddColorModal from './AddColorModal.vue'
import AddSizeModal from './AddSizeModal.vue'
import type { ColorAdded } from './AddColorModal.vue'
import type { SizeAdded } from './AddSizeModal.vue'
import type { ExpandedState } from '@tanstack/vue-table'
import { useProductForm } from '../composables/useProductForm'
import VariantInventorySlideover from '~/features/inventory/components/VariantInventorySlideover.vue'
import EditVariantValuesSlideover from './EditVariantValuesSlideover.vue'

const props = defineProps<{
  iva?: number
  showSku?: boolean
  readonly?: boolean
  selectSizes: SelectOption[]
  selectColors: SelectOption[]
}>()

const { variantGrid, variantData, colors, sizes, isInitializing, form } = useProductForm()

// ─── Tree display types (local only, not exported) ───────────────────────────
interface VariantChildRow extends VariantGridRow {
  isParent: false
  isAddRow?: never
}

interface AddSizeRow {
  id: string
  color: string
  colorId: string
  isParent: false
  isAddRow: true
  missingSizes: string[]
}

type ChildRow = VariantChildRow | AddSizeRow

interface ColorGroupRow {
  id: string
  color: string
  colorId: string
  isParent: true
  subRows: ChildRow[]
}

type AnyRow = ColorGroupRow | ChildRow

// Computed tree from variantGrid — purely for display, variantGrid is NOT changed
const treeData = computed<ColorGroupRow[]>(() => {
  const map = new Map<string, ColorGroupRow>()
  for (const row of variantGrid.value) {
    if (!map.has(row.color)) {
      map.set(row.color, {
        id: `parent-${row.color}`,
        color: row.color,
        colorId: row.colorId,
        isParent: true,
        subRows: []
      })
    }
    map.get(row.color)!.subRows.push({ ...row, isParent: false })
  }
  // Append an "add size" row for each color that has missing sizes
  for (const group of map.values()) {
    const present = new Set(group.subRows.filter((r): r is VariantChildRow => !r.isAddRow).map(r => r.size))
    const missing = sizes.value.filter(s => !present.has(s))
    if (missing.length > 0) {
      group.subRows.push({
        id: `add-${group.color}`,
        color: group.color,
        colorId: group.colorId,
        isParent: false,
        isAddRow: true,
        missingSizes: missing
      })
    }
  }
  return Array.from(map.values())
})

// All parent groups start expanded; new groups added later also auto-expand
const expanded = ref<ExpandedState>(true)

watch(treeData, (newData) => {
  if (expanded.value === true) return
  const current = expanded.value as Record<string, boolean>
  let changed = false
  for (const group of newData) {
    if (!(group.id in current)) {
      current[group.id] = true
      changed = true
    }
  }
  if (changed) expanded.value = { ...current }
})

// ─── Color/options UI ────────────────────────────────────────────────────────

const showColorInput = ref(false)
const showSizeInput = ref(false)

watch(colors, (val) => {
  if (val.length > 0) showColorInput.value = true
}, { immediate: true })

watch(sizes, (val) => {
  if (val.length > 0) showSizeInput.value = true
}, { immediate: true })

const colorHexMap: Record<string, string> = {
  rojo: '#ef4444', roja: '#ef4444',
  blanco: '#ffffff', blanca: '#ffffff',
  negro: '#000000', negra: '#000000',
  azul: '#3b82f6', azules: '#3b82f6',
  verde: '#22c55e',
  amarillo: '#eab308', amarilla: '#eab308',
  naranja: '#f97316',
  rosa: '#ec4899',
  morado: '#a855f7', morada: '#a855f7',
  gris: '#6b7280',
  cafe: '#92400e', marron: '#92400e',
  celeste: '#0ea5e9',
  beige: '#d4b896',
  lila: '#c084fc',
  turquesa: '#14b8a6',
  plateado: '#c0c0c0',
  dorado: '#fbbf24'
}

function normalizeText(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function getColorHex(name: string): string {
  const extra = extraColors.value.find(c => c.label === name)
  if (extra) return extra.hex
  return colorHexMap[normalizeText(name)] ?? '#9ca3af'
}

// ─── Variant data access (reads/writes variantData — unchanged) ───────────────

function getVariant(id: string): VariantEditable {
  return variantData.value[id] ?? {}
}

function updateVariant(id: string, field: keyof VariantEditable, value: any): void {
  variantData.value[id] = { ...variantData.value[id], [field]: value }
}

function deleteVariant(id: string): void {
  variantGrid.value = variantGrid.value.filter(r => r.id !== id)
}

// ─── Row actions (edit mode) ──────────────────────────────────────────────────

const showStockSlideover = ref(false)
const stockVariantId = ref<string | null>(null)

function openStockEditor(id: string): void {
  stockVariantId.value = id
  showStockSlideover.value = true
}

const showValuesSlideover = ref(false)
const valuesVariantId = ref<string | null>(null)

function openValuesEditor(id: string): void {
  valuesVariantId.value = id
  showValuesSlideover.value = true
}

function onValuesUpdated(payload: { id: string, sku: string, costPrice: number, priceAdjustment: number, image: string | null }): void {
  updateVariant(payload.id, 'sku', payload.sku)
  updateVariant(payload.id, 'costPrice', payload.costPrice)
  updateVariant(payload.id, 'adjustAmount', payload.priceAdjustment)
  updateVariant(payload.id, 'image', payload.image)
}

function rowActions(id: string) {
  return [[
    { label: 'Editar stock', icon: 'i-lucide-boxes', onSelect: () => openStockEditor(id) },
    { label: 'Editar variante', icon: 'i-lucide-pencil', onSelect: () => openValuesEditor(id) }
  ], [
    { label: 'Eliminar', icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => deleteVariant(id) }
  ]]
}

function addVariantSize(color: string, colorId: string, size: string): void {
  const sizeId = allSelectSizes.value.find(s => s.label === size)?.value ?? ''
  const id = `${color}-${size}`
  // Rebuild this color's rows sorted by sizes order, then splice back into grid
  const thisColorRows = variantGrid.value.filter(r => r.color === color)
  const colorStart = variantGrid.value.findIndex(r => r.color === color)
  const newRow: VariantGridRow = { id, color, colorId, size, sizeId }
  const sorted = sizes.value
    .map(s => (s === size ? newRow : thisColorRows.find(r => r.size === s)))
    .filter((r): r is VariantGridRow => r !== undefined)
  const before = variantGrid.value.slice(0, colorStart)
  const after = variantGrid.value.slice(colorStart + thisColorRows.length)
  variantGrid.value = [...before, ...sorted, ...after]
}

watch([colors, sizes], ([newColors, newSizes]) => {
  if (isInitializing.value) return
  const newGrid: VariantGridRow[] = []
  for (const color of newColors) {
    for (const size of newSizes) {
      const id = `${color}-${size}`
      const colorId = allSelectColors.value.find(c => c.label === color)?.value ?? ''
      const sizeId = allSelectSizes.value.find(s => s.label === size)?.value ?? ''
      newGrid.push({ id, color, colorId, size, sizeId })
    }
  }
  variantGrid.value = newGrid
}, { deep: true })

const hasVariants = computed(() => variantGrid.value.length > 0)

function getSku(id: string): string {
  return getVariant(id).sku ?? ''
}

function getAdjustAmount(id: string): number {
  return getVariant(id).adjustAmount ?? 0
}

function getSuggestedPrice(id: string): number {
  const base = form.basePrice ?? 0
  return base + getAdjustAmount(id)
}

function getFinalPrice(id: string): number {
  return getSuggestedPrice(id) * (1 + (props.iva ?? 0.16))
}

function getProfit(id: string): number {
  return getFinalPrice(id) - (getVariant(id).costPrice ?? 0)
}

function ivaLabel(): string {
  return `IVA (${((props.iva ?? 0.16) * 100).toFixed(0)}%)`
}

function formatCLP(n: number): string {
  return '$ ' + Math.round(n).toLocaleString('es-CL')
}

// ─── Extra colors/sizes (user-created) ───────────────────────────────────────

const extraColors = ref<Array<SelectOption & { hex: string }>>([])
const extraSizes = ref<SelectOption[]>([])

function onColorAdded(color: ColorAdded) {
  extraColors.value.push(color)
}

function onSizeAdded(size: SizeAdded) {
  extraSizes.value.push(size)
}

const allSelectColors = computed(() => [
  ...props.selectColors,
  ...extraColors.value
])

const allSelectSizes = computed(() => [
  ...props.selectSizes,
  ...extraSizes.value
])

// ─── Color input ──────────────────────────────────────────────────────────────

const colorQuery = ref('')
const colorTagsRef = ref()
const colorInputFocused = ref(false)
const showAddColorModal = ref(false)

const displayedColorSuggestions = computed(() => {
  const available = allSelectColors.value
    .map(c => c.label)
    .filter(label => !colors.value.includes(label))
  if (!colorQuery.value) return available.slice(0, 5)
  const q = normalizeText(colorQuery.value)
  return available.filter(label => normalizeText(label).includes(q))
})

function addColorSuggestion(label: string) {
  if (!colors.value.includes(label)) colors.value.push(label)
  colorQuery.value = ''
  nextTick(() => {
    const input = colorTagsRef.value?.inputRef
    if (input) {
      input.value = ''
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
    }
  })
}

watch(colors, (newVal) => {
  if (!allSelectColors.value.length) return
  const validLabels = new Set(allSelectColors.value.map(c => c.label))
  const filtered = newVal.filter(c => validLabels.has(c))
  if (filtered.length !== newVal.length) colors.value = filtered
})

function onColorFocusOut(e: FocusEvent) {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
    colorInputFocused.value = false
  }
}

function openAddColorModal() {
  colorInputFocused.value = false
  showAddColorModal.value = true
}

watch(showColorInput, (val) => {
  if (!val) {
    colorQuery.value = ''
    colorInputFocused.value = false
  }
})

// ─── Size input ───────────────────────────────────────────────────────────────

const sizeQuery = ref('')
const sizeTagsRef = ref()
const sizeInputFocused = ref(false)
const showAddSizeModal = ref(false)

const displayedSizeSuggestions = computed(() => {
  const available = allSelectSizes.value
    .map(s => s.label)
    .filter(label => !sizes.value.includes(label))
  if (!sizeQuery.value) return available.slice(0, 5)
  const q = normalizeText(sizeQuery.value)
  return available.filter(label => normalizeText(label).includes(q))
})

function addSizeSuggestion(label: string) {
  if (!sizes.value.includes(label)) sizes.value.push(label)
  sizeQuery.value = ''
  nextTick(() => {
    const input = sizeTagsRef.value?.inputRef
    if (input) {
      input.value = ''
      input.dispatchEvent(new InputEvent('input', { bubbles: true }))
    }
  })
}

watch(sizes, (newVal) => {
  if (!allSelectSizes.value.length) return
  const validLabels = new Set(allSelectSizes.value.map(s => s.label))
  const filtered = newVal.filter(s => validLabels.has(s))
  if (filtered.length !== newVal.length) sizes.value = filtered
})

function onSizeFocusOut(e: FocusEvent) {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
    sizeInputFocused.value = false
  }
}

function openAddSizeModal() {
  sizeInputFocused.value = false
  showAddSizeModal.value = true
}

watch(showSizeInput, (val) => {
  if (!val) {
    sizeQuery.value = ''
    sizeInputFocused.value = false
  }
})

// ─── Variant image cropper ────────────────────────────────────────────────────

const variantCropperRef = ref()
const variantEditingId = ref<string | null>(null)
const variantCropperSrc = ref('')
const showVariantCropperModal = ref(false)
const variantPendingObjectUrl = ref<string | null>(null)

const { open: openVariantFileDialog, onChange: onVariantFileChange } = useFileDialog({
  accept: 'image/*',
  multiple: false
})

onVariantFileChange((files) => {
  const file = files?.[0]
  if (!file || !variantEditingId.value) return
  if (variantPendingObjectUrl.value) URL.revokeObjectURL(variantPendingObjectUrl.value)
  const url = URL.createObjectURL(file)
  variantPendingObjectUrl.value = url
  variantCropperSrc.value = url
  showVariantCropperModal.value = true
})

function onVariantImageClick(id: string) {
  variantEditingId.value = id
  const current = getVariant(id).image
  if (current) {
    variantCropperSrc.value = current
    showVariantCropperModal.value = true
  } else {
    openVariantFileDialog()
  }
}

function replaceVariantImage(id: string) {
  variantEditingId.value = id
  openVariantFileDialog()
}

function removeVariantImage(id: string) {
  const old = getVariant(id).image
  if (old?.startsWith('blob:')) URL.revokeObjectURL(old)
  updateVariant(id, 'image', null)
}

function applyVariantEdit() {
  if (!variantCropperRef.value || !variantEditingId.value) return
  const { canvas } = variantCropperRef.value.getResult()
  canvas.toBlob((blob: Blob | null) => {
    if (!blob || !variantEditingId.value) return
    const old = getVariant(variantEditingId.value).image
    if (old?.startsWith('blob:')) URL.revokeObjectURL(old)
    if (variantPendingObjectUrl.value) {
      URL.revokeObjectURL(variantPendingObjectUrl.value)
      variantPendingObjectUrl.value = null
    }
    updateVariant(variantEditingId.value, 'image', URL.createObjectURL(blob))
    updateVariant(variantEditingId.value, 'imageBlob', blob)
    showVariantCropperModal.value = false
    variantEditingId.value = null
  }, 'image/jpeg', 0.92)
}

function rotateVariant(angle: number) {
  variantCropperRef.value?.rotate(angle)
}

function flipVariantX() {
  variantCropperRef.value?.flip(true, false)
}
function flipVariantY() {
  variantCropperRef.value?.flip(false, true)
}

onUnmounted(() => {
  for (const v of Object.values(variantData.value)) {
    if (v.image?.startsWith('blob:')) URL.revokeObjectURL(v.image)
  }
  if (variantPendingObjectUrl.value) URL.revokeObjectURL(variantPendingObjectUrl.value)
})

// ─── Table columns ────────────────────────────────────────────────────────────

const columns = computed(() => [
  { id: 'colorOrSize', header: 'Color / Talla' },
  { id: 'image', header: 'Imagen' },
  ...(props.showSku ? [{ id: 'sku', header: 'SKU' }] : []),
  { id: 'costPrice', header: 'Costo unitario' },
  { id: 'priceAdjust', header: 'Ajuste' },
  { id: 'suggestedPrice', header: 'Precio sugerido' },
  { id: 'finalPrice', header: 'Precio final' },
  { id: 'profit', header: 'Ganancia' },
  { id: 'initialStock', header: 'Stock inicial' },
  { id: 'actions', header: '' }
])
</script>

<template>
  <div class="p-6 border border-[#ececed] rounded-xl bg-white">
    <div class="mb-5">
      <h3 class="font-semibold text-base">
        Variantes
      </h3>
      <p class="text-sm text-gray-500 mt-0.5">
        Define las opciones y administra los detalles de cada combinación de variante.
      </p>
    </div>

    <!-- Options grid -->
    <div class="grid grid-cols-2 gap-8 mb-6">
      <!-- Color -->
      <div>
        <p class="text-sm font-semibold text-gray-700 mb-1">
          Opciones de variantes
        </p>
        <p class="text-sm text-gray-500 mb-2">
          Color
        </p>

        <template v-if="!showColorInput">
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-lucide-plus"
            @click="showColorInput = true"
          >
            Agregar opción
          </UButton>
        </template>
        <template v-else>
          <div
            class="relative"
            @input="colorQuery = ($event.target as HTMLInputElement).value"
            @focusin="colorInputFocused = true"
            @focusout="onColorFocusOut"
          >
            <UInputTags
              ref="colorTagsRef"
              v-model="colors"
              placeholder="Ej. Rojo, Azul…"
              add-on-blur
              class="w-full"
            />
            <ul
              v-if="colorInputFocused"
              class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
            >
              <li
                v-for="item in displayedColorSuggestions"
                :key="item"
                class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                @mousedown.prevent="addColorSuggestion(item)"
              >
                <div
                  class="w-3 h-3 rounded-full border border-gray-300 shrink-0"
                  :style="{ backgroundColor: getColorHex(item) }"
                />
                {{ item }}
              </li>
              <li
                class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary border-t border-gray-100"
                @mousedown.prevent="openAddColorModal"
              >
                <UIcon
                  name="i-lucide-plus"
                  class="w-3.5 h-3.5 shrink-0"
                />
                Agregar color
              </li>
            </ul>
          </div>

          <AddColorModal
            v-model:open="showAddColorModal"
            @add="onColorAdded"
          />
        </template>
      </div>

      <!-- Talla -->
      <div>
        <p class="text-sm font-semibold text-gray-700 mb-1">
          Talla
        </p>
        <p class="text-sm text-gray-500 mb-2">
          &nbsp;
        </p>

        <template v-if="!showSizeInput">
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-lucide-plus"
            @click="showSizeInput = true"
          >
            Agregar opción
          </UButton>
        </template>

        <template v-else>
          <div
            class="relative"
            @input="sizeQuery = ($event.target as HTMLInputElement).value"
            @focusin="sizeInputFocused = true"
            @focusout="onSizeFocusOut"
          >
            <UInputTags
              ref="sizeTagsRef"
              v-model="sizes"
              placeholder="Ej. XS, S, M, L, XL…"
              add-on-blur
              class="w-full"
            />
            <ul
              v-if="sizeInputFocused"
              class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
            >
              <li
                v-for="item in displayedSizeSuggestions"
                :key="item"
                class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                @mousedown.prevent="addSizeSuggestion(item)"
              >
                {{ item }}
              </li>
              <li
                class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary border-t border-gray-100"
                @mousedown.prevent="openAddSizeModal"
              >
                <UIcon
                  name="i-lucide-plus"
                  class="w-3.5 h-3.5 shrink-0"
                />
                Agregar talla
              </li>
            </ul>
          </div>

          <AddSizeModal
            v-model:open="showAddSizeModal"
            @add="onSizeAdded"
          />
        </template>
      </div>
    </div>

    <!-- Variants table -->
    <template v-if="hasVariants">
      <p class="text-sm font-semibold text-gray-700 mb-3">
        Variantes
        <span class="font-normal text-gray-500">
          ({{ variantGrid.length }} combinaciones)
        </span>
      </p>
      <div class="overflow-auto border border-solid rounded-lg border-default">
        <UTable
          v-model:expanded="expanded"
          :data="treeData"
          :columns="columns"
          :get-sub-rows="(row: any) => (row as ColorGroupRow).subRows"
          :get-row-id="(row: any) => (row as AnyRow).id"
        >
          <!-- Column headers -->
          <template #priceAdjust-header>
            <div class="flex items-center gap-1">
              <span>Ajuste</span>
              <UTooltip text="Monto fijo añadido al precio base para calcular el precio sugerido">
                <UIcon
                  name="i-lucide-info"
                  class="w-3.5 h-3.5 text-gray-400 cursor-help"
                />
              </UTooltip>
            </div>
          </template>

          <template #finalPrice-header>
            <div class="leading-tight">
              <div>Precio final</div>
              <div class="text-xs font-normal text-gray-400">
                ({{ ivaLabel() }} incl.)
              </div>
            </div>
          </template>

          <!-- ── First column: color group (parent) or talla (child) ── -->
          <template #colorOrSize-cell="{ row }">
            <!-- Parent row: color group header with expand toggle -->
            <template v-if="(row.original as AnyRow).isParent">
              <button
                type="button"
                class="flex items-center gap-2 w-full py-0.5"
                @click="row.toggleExpanded()"
              >
                <UIcon
                  :name="row.getIsExpanded() ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                  class="w-4 h-4 text-gray-400 shrink-0"
                />
                <div
                  class="w-3 h-3 rounded-full border border-gray-300 shrink-0"
                  :style="{ backgroundColor: getColorHex((row.original as ColorGroupRow).color) }"
                />
                <span class="font-medium text-gray-800">
                  {{ (row.original as ColorGroupRow).color }}
                </span>
                <UBadge
                  variant="subtle"
                  color="neutral"
                  size="sm"
                >
                  {{ (row.original as ColorGroupRow).subRows.filter(r => !r.isAddRow).length }} tallas
                </UBadge>
              </button>
            </template>

            <!-- Add-size row: button to re-add a deleted size -->
            <template v-else-if="(row.original as AddSizeRow).isAddRow">
              <UDropdownMenu
                :items="[(row.original as AddSizeRow).missingSizes.map(s => ({
                  label: s,
                  onSelect: () => addVariantSize(
                    (row.original as AddSizeRow).color,
                    (row.original as AddSizeRow).colorId,
                    s
                  )
                }))]"
              >
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-plus"
                  class="ml-7 text-gray-400 hover:text-gray-700"
                >
                  Agregar talla
                </UButton>
              </UDropdownMenu>
            </template>

            <!-- Child row: size name with indent -->
            <template v-else>
              <span class="pl-7 text-sm text-gray-600">
                {{ (row.original as VariantGridRow).size }}
              </span>
            </template>
          </template>

          <!-- ── Image cell (child only) ── -->
          <template #image-cell="{ row }">
            <template v-if="!(row.original as AnyRow).isParent && !(row.original as AddSizeRow).isAddRow">
              <!-- Read-only image (edit mode) -->
              <template v-if="readonly">
                <img
                  v-if="getVariant((row.original as VariantGridRow).id).image"
                  :src="getVariant((row.original as VariantGridRow).id).image!"
                  class="w-12 h-12 rounded-md object-cover border border-gray-200"
                >
                <div
                  v-else
                  class="w-12 h-12 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-image"
                    class="w-5 h-5 text-gray-300"
                  />
                </div>
              </template>

              <div
                v-else
                class="relative group w-12 h-12"
              >
                <button
                  v-if="!getVariant((row.original as VariantGridRow).id).image"
                  type="button"
                  class="w-12 h-12 rounded-md border-2 border-dashed border-gray-200 hover:border-primary flex items-center justify-center transition-colors cursor-pointer"
                  @click="onVariantImageClick((row.original as VariantGridRow).id)"
                >
                  <UIcon
                    name="i-lucide-image-plus"
                    class="w-5 h-5 text-gray-300"
                  />
                </button>

                <template v-else>
                  <img
                    :src="getVariant((row.original as VariantGridRow).id).image!"
                    class="w-12 h-12 rounded-md object-cover border border-gray-200"
                  >
                  <div class="absolute inset-0 rounded-md bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      type="button"
                      class="w-5 h-5 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                      @click="onVariantImageClick((row.original as VariantGridRow).id)"
                    >
                      <UIcon
                        name="i-lucide-pencil"
                        class="w-3 h-3 text-gray-700"
                      />
                    </button>
                    <button
                      type="button"
                      class="w-5 h-5 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                      @click="replaceVariantImage((row.original as VariantGridRow).id)"
                    >
                      <UIcon
                        name="i-lucide-refresh-cw"
                        class="w-3 h-3 text-gray-700"
                      />
                    </button>
                    <button
                      type="button"
                      class="w-5 h-5 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                      @click="removeVariantImage((row.original as VariantGridRow).id)"
                    >
                      <UIcon
                        name="i-lucide-trash-2"
                        class="w-3 h-3 text-red-500"
                      />
                    </button>
                  </div>
                </template>
              </div>
            </template>
          </template>

          <!-- ── SKU cell (child only, read-only) ── -->
          <template #sku-cell="{ row }">
            <template v-if="!(row.original as AnyRow).isParent && !(row.original as AddSizeRow).isAddRow">
              <span class="text-sm text-gray-700 font-mono">
                {{ getSku((row.original as VariantGridRow).id) }}
              </span>
            </template>
          </template>

          <!-- ── Cost price cell (child only) ── -->
          <template #costPrice-cell="{ row }">
            <template v-if="!(row.original as AnyRow).isParent && !(row.original as AddSizeRow).isAddRow">
              <span
                v-if="readonly"
                class="text-sm text-gray-700 whitespace-nowrap"
              >
                {{ formatCLP(getVariant((row.original as VariantGridRow).id).costPrice ?? 0) }}
              </span>
              <UInput
                v-else
                :model-value="getVariant((row.original as VariantGridRow).id).costPrice ?? 0"
                type="number"
                size="sm"
                :min="0"
                class="w-28"
                @update:model-value="updateVariant((row.original as VariantGridRow).id, 'costPrice', Number($event) || 0)"
              >
                <template #leading>
                  <span class="text-xs text-gray-500">$</span>
                </template>
              </UInput>
            </template>
          </template>

          <!-- ── Price adjust cell (child only) ── -->
          <template #priceAdjust-cell="{ row }">
            <template v-if="!(row.original as AnyRow).isParent && !(row.original as AddSizeRow).isAddRow">
              <span
                v-if="readonly"
                class="text-sm text-gray-700 whitespace-nowrap"
              >
                {{ formatCLP(getAdjustAmount((row.original as VariantGridRow).id)) }}
              </span>
              <UInput
                v-else
                :model-value="getAdjustAmount((row.original as VariantGridRow).id)"
                type="number"
                size="sm"
                class="w-20"
                @update:model-value="updateVariant((row.original as VariantGridRow).id, 'adjustAmount', Number($event) || 0)"
              >
                <template #leading>
                  <span class="text-xs text-gray-500">$</span>
                </template>
              </UInput>
            </template>
          </template>

          <!-- ── Suggested price cell (child only) ── -->
          <template #suggestedPrice-cell="{ row }">
            <template v-if="!(row.original as AnyRow).isParent && !(row.original as AddSizeRow).isAddRow">
              <span class="text-sm text-gray-700 whitespace-nowrap">
                {{ formatCLP(getSuggestedPrice((row.original as VariantGridRow).id)) }}
              </span>
            </template>
          </template>

          <!-- ── Final price cell (child only) ── -->
          <template #finalPrice-cell="{ row }">
            <template v-if="!(row.original as AnyRow).isParent && !(row.original as AddSizeRow).isAddRow">
              <span class="text-sm font-medium text-gray-900 whitespace-nowrap">
                {{ formatCLP(getFinalPrice((row.original as VariantGridRow).id)) }}
              </span>
            </template>
          </template>

          <!-- ── Profit cell (child only) ── -->
          <template #profit-cell="{ row }">
            <template v-if="!(row.original as AnyRow).isParent && !(row.original as AddSizeRow).isAddRow">
              <span
                class="text-sm font-medium whitespace-nowrap"
                :class="getProfit((row.original as VariantGridRow).id) >= 0 ? 'text-green-600' : 'text-red-500'"
              >
                {{ formatCLP(getProfit((row.original as VariantGridRow).id)) }}
              </span>
            </template>
          </template>

          <!-- ── Stock cell (child only) ── -->
          <template #initialStock-cell="{ row }">
            <template v-if="!(row.original as AnyRow).isParent && !(row.original as AddSizeRow).isAddRow">
              <span
                v-if="readonly"
                class="text-sm text-gray-700 tabular-nums"
              >
                {{ getVariant((row.original as VariantGridRow).id).initialStock ?? 0 }}
              </span>
              <UInputNumber
                v-else
                :model-value="getVariant((row.original as VariantGridRow).id).initialStock ?? 0"
                size="sm"
                :min="0"
                :step="1"
                class="w-20"
                @update:model-value="updateVariant((row.original as VariantGridRow).id, 'initialStock', $event ?? 0)"
              />
            </template>
          </template>

          <!-- ── Actions cell (child only) ── -->
          <template #actions-cell="{ row }">
            <template v-if="!(row.original as AnyRow).isParent && !(row.original as AddSizeRow).isAddRow">
              <UDropdownMenu
                :items="readonly
                  ? rowActions((row.original as VariantGridRow).id)
                  : [[{ label: 'Eliminar', icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => deleteVariant((row.original as VariantGridRow).id) }]]"
              >
                <UButton
                  icon="i-lucide-ellipsis-vertical"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                />
              </UDropdownMenu>
            </template>
          </template>
        </UTable>
      </div>
    </template>

    <!-- Variant image editor modal -->
    <UModal
      v-model:open="showVariantCropperModal"
      title="Editar imagen de variante"
      size="xl"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <Cropper
          ref="variantCropperRef"
          class="h-96 w-full rounded-lg overflow-hidden bg-gray-900"
          :src="variantCropperSrc"
        />
        <div class="flex items-center gap-2 mt-4">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-rotate-ccw"
            @click="rotateVariant(-90)"
          >
            Rotar izq.
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-rotate-cw"
            @click="rotateVariant(90)"
          >
            Rotar der.
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-flip-horizontal-2"
            @click="flipVariantX"
          >
            Voltear H
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-flip-vertical-2"
            @click="flipVariantY"
          >
            Voltear V
          </UButton>
        </div>
      </template>
      <template #footer>
        <UButton
          color="neutral"
          variant="outline"
          @click="showVariantCropperModal = false"
        >
          Cancelar
        </UButton>
        <UButton @click="applyVariantEdit">
          Aplicar cambios
        </UButton>
      </template>
    </UModal>

    <!-- Stock editor (edit mode) -->
    <VariantInventorySlideover
      v-model:open="showStockSlideover"
      :variant-id="stockVariantId"
    />

    <!-- Values editor (edit mode) -->
    <EditVariantValuesSlideover
      v-model:open="showValuesSlideover"
      :variant-id="valuesVariantId"
      @updated="onValuesUpdated"
    />
  </div>
</template>
