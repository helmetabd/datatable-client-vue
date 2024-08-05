<style>
@import '/src/assets/dataTables.bootstrap5.min.css';
@import '/src/assets/buttons.bootstrap5.min.css';
@import '/src/assets/buttons.dataTables.min.css';
@import '/src/assets/responsive.bootstrap.min.css';
.active {
  font-weight: bold;
}

.material-icons {
  vertical-align: middle;
}
</style>
<script setup lang="ts">
import { reactive, computed, onMounted, ref, withDefaults, inject } from 'vue'
import * as XLSX from 'xlsx'
import moment from 'moment'
import Clipboard from 'clipboard'
import Spinner from './SpinnerComponent.vue'
import StackedAvatar from './StackedAvatar.vue'
import Offcanvas from './base-offcanvas.vue'
import PercentageBadge from './percentage-badge.vue'
import thousandSeparator from '../utils/thousandSeparator'
import { getAvatar } from '../utils/assetsHelper.js'
import { calculateGrowth } from '../utils/calculationHelper.js'

interface ButtonConfig {
  excel: boolean
  copy: boolean
  print: boolean
}

interface Column {
  name: string
  label: string
  sortable: boolean
  filterable: boolean
  width?: string
  bold?: boolean
  headerClass?: string
  routeName?: string
  class?: string
  isNumber?: boolean
  targetCollapsed?: boolean
  currency?: string
  fixedNumber?: number
  percentage?: { target: string; actual: string }
  custom?: any
  badge?: any
  dateConfig?: any
  offcanvas?: any
  stackedImage?: boolean
  isArray?: boolean
  isFirst?: boolean
  isLast?: boolean
  defaultValue?: any
  display?: string
  customizeRow?: boolean
  params?: { id: string; date: any }
}

interface GroupHeader {
  title: string
  colspan: number
  class?: string
}

interface CustomRow {
  value: string
  class: string
}

interface Props {
  table_search?: boolean
  table_show?: boolean
  table_pagination?: boolean
  table_class?: string
  group?: boolean
  collapsed?: boolean
  sortBy?: string
  order?: number
  page_size?: number
  dataTable: any[]
  column: Column[]
  headerGroup?: GroupHeader[]
  buttons?: ButtonConfig
  customRow?: CustomRow
  copyTitle?: string
}

const url = inject('asset_url') as string

const props = withDefaults(defineProps<Props>(), {
  table_search: true,
  table_show: true,
  table_pagination: true,
  table_class: '',
  group: false,
  collapsed: false,
  sortBy: '',
  order: 1,
  page_size: 10,
  dataTable: () => [],
  column: () => [],
  headerGroup: () => [],
  buttons: () => {
    return { excel: false, copy: false, print: false }
  }
})

const state = reactive({
  items: props.dataTable,
  columns: props.column,
  groupHeader: props.headerGroup,
  filter: '',
  sortKey: props.sortBy,
  sortOrders: props.order,
  pageSize: props.page_size,
  currentPage: 1,
  pageSizeOptions: [10, 25, 50, 100]
})

const isDataEmpty = ref(false)

const loading = computed(() => filteredItems.value?.length === 0)

const filteredItems = computed(() => {
  if (!state.filter) {
    return props.dataTable
  }

  return props.dataTable.filter((item) => {
    return Object.keys(item).some(
      (name) =>
        isColumnFilterable(name) &&
        String(item[name]).toLowerCase().includes(state.filter.toLowerCase())
    )
  })
})

const sortedItems = computed(() => {
  const filterData = filteredItems.value
  const sortingKey = state.sortKey
  if (!sortingKey) {
    return filterData
  }
  return filterData.slice().sort((a, b) => {
    let aValue = a[sortingKey]
    let bValue = b[sortingKey]

    const column = state.columns.find((column) => column.name === sortingKey)

    if (column?.isNumber) {
      aValue = parseFloat(aValue)
      bValue = parseFloat(bValue)
    }

    return aValue > bValue ? state.sortOrders : -state.sortOrders
  })
})

const totalPages = computed(() => {
  return sortedItems.value.length ? Math.ceil(sortedItems.value.length / state.pageSize) : 1
})

const paginatedItems = computed(() => {
  const start = (state.currentPage - 1) * state.pageSize
  const end = start + state.pageSize
  return sortedItems.value.slice(start, end)
})

const pages = computed(() => {
  const pagesArray: number[] = []
  for (let i = 1; i <= totalPages.value; i++) {
    pagesArray.push(i)
  }
  return pagesArray
})

const entriesRange = computed(() => {
  let start = 0
  let end = 0
  let total = 0
  if (sortedItems.value.length) {
    start = (state.currentPage - 1) * state.pageSize + 1
    end = Math.min(state.currentPage * state.pageSize, filteredItems.value.length)
    total = filteredItems.value.length
  }
  return `${start} to ${end} of ${total}`
})

const ellipsisPages = computed(() => {
  const visiblePages = 5
  let start = state.currentPage - Math.floor(visiblePages / 2)
  start = Math.max(start, 1)
  let end = start + visiblePages - 1
  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(end - visiblePages + 1, 1)
  }
  return {
    start,
    end,
    range: Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }
})

const avatar = (avatar: string | string[]) => getAvatar(avatar, url)

const formatDate = (date: string | Date, beforeFormat: string, afterFormat: string) => {
  if (date) {
    return moment(date, beforeFormat).format(afterFormat)
  }
  return ''
}

const toggleSorting = (column: Column) => {
  if (column.sortable) {
    state.sortKey = column.name
    state.sortOrders *= -1
  }
}

const isColumnFilterable = (key: string) => {
  const column = state.columns.find((column) => column.name === key)
  return column ? column.filterable : false
}

const prevPage = () => {
  if (state.currentPage > 1) {
    state.currentPage--
  }
}

const nextPage = () => {
  if (state.currentPage < totalPages.value) {
    state.currentPage++
  }
}

const goToPage = (pageNumber: number) => {
  state.currentPage = pageNumber
}

const checkIcon = (column: Column) => {
  if (column.sortable) {
    if (state.sortKey === column.name) {
      return state.sortOrders === 1 ? 'sorting sorting_asc' : 'sorting sorting_desc'
    }
    return 'sorting'
  }
  return ''
}

function getObjectValue<T extends object>(obj: T, path: string, defaultValue: any = null): any {
  if (!path.includes('.')) {
    return obj[path as keyof T] !== undefined && obj[path as keyof T] !== null
      ? obj[path as keyof T]
      : defaultValue
  }

  const keys = path.split('.')
  let result: any = obj

  for (const key of keys) {
    if (result !== null && result !== undefined && typeof result === 'object') {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result = result[key]
      } else {
        return defaultValue
      }
    } else {
      return defaultValue
    }
  }

  return result !== undefined && result !== null ? result : defaultValue
}

const formatObjectArray = (arr: any[], obj: string | number) => {
  return arr.map((item) => item[obj]).join(', ')
}

const loadingState = ref(loading.value)
const selectedItem = ref<any>(null)
const offcanvasRef = ref<any>(null)

const openOffcanvas = (params: object) => {
  selectedItem.value = params
}

const toggleCollapsed = (id: string | number) => {
  let elementRow = document.getElementById('row_' + id)
  let elementChild = document.getElementById('child_' + id)
  if (elementRow.className === '') {
    elementRow.classList.add('dt-hasChild')
    elementRow.classList.add('parent')
    elementChild.style.visibility = 'visible'
  } else {
    elementRow.classList.remove('dt-hasChild')
    elementRow.classList.remove('parent')
    elementChild.style.visibility = 'collapse'
  }
}

const tableData = ref<HTMLElement | null>(null)
const copyInfo = ref<HTMLElement | null>(null)

const exportToExcel = () => {
  if (tableData.value) {
    const ws = XLSX.utils.table_to_sheet(tableData.value)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, `${props.copyTitle ?? 'Report'}.xlsx`)
  }
}

const copyToClipboard = () => {
  if (tableData.value) {
    const clipboard = new Clipboard('#copyButton', {
      target: () => tableData.value
    })

    clipboard.on('success', () => {
      clipboard.destroy()
      if (copyInfo.value) {
        copyInfo.value.style.display = 'block'
        setTimeout(() => {
          if (copyInfo.value) copyInfo.value.style.display = 'none'
        }, 2000)
      }
      window.getSelection()?.removeAllRanges()
    })

    clipboard.on('error', () => {
      alert('Failed to copy.')
    })
  }
}

const printTable = () => {
  if (tableData.value) {
    const printWindow = window.open('about:blank', '_blank')
    if (printWindow) {
      printWindow.document.write(
        `<html><head><title>${props.copyTitle ?? 'Print'}</title></head><body>`
      )
      printWindow.document.write(`<h3>${props.copyTitle ?? 'Print'}</h3>`)
      printWindow.document.write(tableData.value.outerHTML)
      printWindow.document.write('</body></html>')
      printWindow.document.close()
      printWindow.print()
    }
  }
}
onMounted(() => {
  if (loading.value) {
    setTimeout(() => {
      isDataEmpty.value = true
      loadingState.value = false
    }, 6000)
  }
})
</script>

<template>
  <div class="dataTables_wrapper dt-bootstrap5 no-footer">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_length" v-if="props.table_show">
          <label>
            Show
            <select
              v-model="state.pageSize"
              id="pageSize"
              aria-controls="datatable"
              class="form-select form-select-sm"
            >
              <option v-for="(option, index) in state.pageSizeOptions" :value="option" :key="index">
                {{ option }}
              </option>
            </select>
            entries
          </label>
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_filter" v-if="props.table_search">
          <label for="filter"
            >Search:<input
              type="search"
              v-model="state.filter"
              id="filter"
              class="form-control form-control-sm"
              aria-controls="datatable"
            />
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="dt-buttons" v-if="props.buttons">
          <button
            v-if="props.buttons.copy"
            class="dt-button buttons-copy buttons-html5"
            tabindex="0"
            type="button"
            id="copyButton"
            @click="copyToClipboard"
          >
            <span>Copy</span>
          </button>
          <button
            v-if="props.buttons.excel"
            class="dt-button buttons-excel buttons-html5"
            tabindex="0"
            type="button"
            @click="exportToExcel"
          >
            <span>Excel</span>
          </button>
          <button
            v-if="props.buttons.print"
            class="dt-button buttons-print"
            tabindex="0"
            type="button"
            @click="printTable"
          >
            <span>Print</span>
          </button>
        </div>
        <table
          ref="tableData"
          id="datatable"
          class="table table-hover table-bordered align-middle text-nowrap dt-responsive nowrap no-footer dataTable"
          :class="props.collapsed ? 'dtr-inline collapsed' : props.table_class"
          style="width: 100%"
          aria-describedby="datatable_info"
        >
          <thead class="align-middle">
            <tr v-if="group">
              <th
                v-for="group in state.groupHeader"
                :colspan="group.colspan"
                :key="group.title"
                :class="group.class"
              >
                {{ group.title }}
              </th>
            </tr>
            <tr>
              <th
                v-for="(column, index) in state.columns"
                :key="index"
                @click="toggleSorting(column)"
                :style="
                  'width:' +
                  column.width +
                  '; cursor:' +
                  (column.sortable ? ' pointer;' : ' default;')
                "
                :class="checkIcon(column) + ' ' + column.headerClass"
                aria-controls="datatable"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in paginatedItems" :key="index">
              <tr
                :id="'row_' + index"
                :class="
                  props.customRow && getObjectValue(item, props.customRow.value)
                    ? props.customRow.class
                    : ''
                "
              >
                <td
                  v-for="(column, columnIndex) in state.columns"
                  :key="columnIndex"
                  :class="column.targetCollapsed ? 'dtr-control' : ''"
                  @click="column.targetCollapsed && toggleCollapsed(index)"
                >
                  <template v-if="column.isNumber">
                    <div :class="column.class">
                      <span style="float: left" v-if="column.currency">{{ column.currency }}</span>
                      {{
                        getObjectValue(item, column.name)
                          ? column.fixedNumber
                            ? getObjectValue(item, column.name)
                                .toFixed(column.fixedNumber)
                                .replace('.', ',')
                            : thousandSeparator(getObjectValue(item, column.name))
                          : 0
                      }}
                    </div>
                  </template>
                  <template v-else-if="column.percentage">
                    <div :class="column.class">
                      <PercentageBadge
                        :label="
                          calculateGrowth(
                            getObjectValue(item, column.percentage.target),
                            getObjectValue(item, column.percentage.actual)
                          ).result
                        "
                        :status="
                          calculateGrowth(
                            getObjectValue(item, column.percentage.target),
                            getObjectValue(item, column.percentage.actual)
                          ).success
                        "
                      >
                      </PercentageBadge>
                    </div>
                  </template>
                  <template v-else-if="column.custom">
                    <div
                      v-if="column.custom.routeName"
                      :class="(column.bold ? 'fw-bolder ' : 'fw-normal ') + column.class"
                    >
                      <span>
                        <i
                          v-if="column.custom.icon"
                          :class="column.custom.icon"
                          :style="
                            column.custom.iconColorObject
                              ? 'color: ' +
                                getObjectValue(item, column.custom.iconColorObject) +
                                ';'
                              : column.custom.iconColor
                                ? 'color: ' + column.custom.iconColor + ';'
                                : null
                          "
                        ></i>
                        <img
                          v-if="column.custom.image"
                          :src="avatar(getObjectValue(item, column.custom.image))"
                          class="rounded-circle avatar-xxs me-2"
                        />
                        <template v-if="column.isFirst">
                          <router-link
                            :to="{
                              name: column.custom.routeName,
                              params: {
                                id: getObjectValue(item[column.name][0], column.custom.params)
                              }
                            }"
                          >
                            {{ getObjectValue(item[column.name][0], column.display) }}
                          </router-link>
                        </template>
                        <template v-else-if="column.isLast">
                          <router-link
                            :to="{
                              name: column.custom.routeName,
                              params: {
                                id: getObjectValue(
                                  item[column.name][item.length - 1],
                                  column.custom.params
                                )
                              }
                            }"
                          >
                            {{ getObjectValue(item[column.name][item.length - 1], column.display) }}
                          </router-link>
                        </template>
                        <template v-else>
                          <router-link
                            :to="{
                              name: column.custom.routeName,
                              params: {
                                id: getObjectValue(item, column.custom.params)
                              }
                            }"
                          >
                            {{ getObjectValue(item, column.name) }}
                            <i
                              v-if="
                                column.custom.uniqueFirst &&
                                getObjectValue(item, column.custom.uniqueFirst.fields) ===
                                  column.custom.uniqueFirst.value
                              "
                              :class="column.custom.uniqueFirst.icon"
                            ></i>
                          </router-link>
                        </template>
                      </span>
                    </div>
                    <template v-else-if="column.custom.image">
                      <img
                        v-if="column.custom.image"
                        :src="avatar(getObjectValue(item, column.custom.image))"
                        class="rounded-circle avatar-xxs me-2"
                      />
                      {{ getObjectValue(item, column.name) }}
                      <i
                        v-if="
                          column.custom.uniqueFirst &&
                          getObjectValue(item, column.custom.uniqueFirst.fields) ===
                            column.custom.uniqueFirst.value
                        "
                        :class="column.custom.uniqueFirst.icon"
                      ></i>
                    </template>
                    <div v-else :class="column.class">
                      <span>
                        <i :class="column.custom.icon"></i>
                        {{ item[column.name] }}
                      </span>
                    </div>
                  </template>
                  <template v-else-if="column.badge">
                    <template v-if="column.badge.types">
                      <div v-if="column.badge.isArray">
                        <div v-for="(array, indexA) in item[column.name]" :key="indexA">
                          <div v-for="(model, indexB) in column.badge.types" :key="indexB">
                            <div v-if="model.value === getObjectValue(array, column.badge.display)">
                              <span
                                v-if="column.badge.custom"
                                :class="'badge text-' + model.textColor"
                                :style="'background-color: ' + model.color + ';'"
                                >{{
                                  model.label
                                    ? model.label
                                    : getObjectValue(array, column.badge.display)
                                }}</span
                              >
                              <span
                                v-else
                                :class="
                                  'badge bg-' + model.type + '-subtle text-' + model.type + ' p-2'
                                "
                                >{{
                                  model.label
                                    ? model.label
                                    : getObjectValue(array, column.badge.display)
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <template v-else>
                        <template v-for="(model, indexA) in column.badge.types" :key="indexA">
                          <template v-if="model.value === getObjectValue(item, column.name)">
                            <span
                              v-if="column.badge.custom"
                              :class="'badge text-' + model.textColor"
                              :style="'background-color: ' + model.color + ';'"
                            >
                              {{ model.label ? model.label : getObjectValue(item, column.name) }}
                            </span>
                            <span
                              v-else
                              :class="
                                'badge bg-' + model.type + '-subtle text-' + model.type + ' p-2'
                              "
                              >{{
                                model.label ? model.label : getObjectValue(item, column.name)
                              }}</span
                            >
                          </template>
                        </template>
                      </template>
                    </template>
                    <div v-else id="Badge">
                      <div v-if="column.badge.isArray">
                        <template v-for="(array, indexA) in item[column.name]" :key="indexA">
                          <span
                            v-if="column.badge.custom"
                            :class="'badge text-' + column.badge.textColor"
                            :style="
                              'background-color: ' + getObjectValue(array, column.badge.color) + ';'
                            "
                            >{{ getObjectValue(array, column.badge.display) }}</span
                          >
                          <span
                            v-else
                            :class="
                              'badge bg-' +
                              column.badge.type +
                              '-subtle text-' +
                              column.badge.type +
                              ' p-2'
                            "
                            >{{ getObjectValue(array, column.badge.display) }}</span
                          >
                        </template>
                      </div>
                      <div v-else>
                        <span
                          v-if="column.badge.custom"
                          :class="'badge text-' + column.badge.textColor"
                          :style="
                            'background-color: ' + getObjectValue(item, column.badge.color) + ';'
                          "
                          >{{ getObjectValue(item, column.name) }}</span
                        >
                        <span
                          v-else
                          :class="
                            'badge bg-' +
                            column.badge.type +
                            '-subtle text-' +
                            column.badge.type +
                            ' p-2'
                          "
                          >{{ getObjectValue(item, column.name) }}</span
                        >
                      </div>
                    </div>
                  </template>
                  <template v-else-if="column.dateConfig">
                    <router-link
                      v-if="column.routeName"
                      :to="{
                        name: column.routeName,
                        params: {
                          id: getObjectValue(item, column.params.id)
                        },
                        query: {
                          date: getObjectValue(item, column.params.date)
                        }
                      }"
                    >
                      {{
                        formatDate(
                          item[column.name],
                          column.dateConfig.before,
                          column.dateConfig.after
                        )
                      }}
                    </router-link>
                    <template v-else>
                      {{
                        formatDate(
                          item[column.name],
                          column.dateConfig.before,
                          column.dateConfig.after
                        )
                      }}
                    </template>
                  </template>
                  <template v-else-if="column.offcanvas">
                    <button
                      class="btn btn-light btn-sm"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRightTrial"
                      aria-controls="offcanvasRightTrial"
                      @click="
                        openOffcanvas({
                          courier: getObjectValue(item, column.offcanvas.courier),
                          tracking_number: item[column.name]
                        })
                      "
                    >
                      {{ item[column.name] }}
                    </button>
                  </template>
                  <template v-else-if="column.stackedImage">
                    <StackedAvatar :collections="item[column.name]" />
                  </template>
                  <template v-else-if="column.isArray">
                    <template v-if="column.isFirst">
                      {{ getObjectValue(item[column.name][0], column.display) }}
                    </template>
                    <template v-else-if="column.isLast">
                      {{ getObjectValue(item[column.name][item.length - 1], column.display) }}
                    </template>
                    <template v-else>
                      <template>
                        {{ formatObjectArray(item[column.name], column.display) }}
                      </template>
                    </template>
                  </template>
                  <template v-else-if="column.defaultValue">
                    {{ getObjectValue(item, column.name, column.defaultValue) }}
                  </template>
                  <template v-else-if="column.customizeRow">
                    <slot :name="`column-${column.name}`" :item="item" />
                  </template>
                  <template v-else>
                    {{ getObjectValue(item, column.name) }}
                  </template>
                </td>
              </tr>
              <tr
                v-if="props.collapsed"
                class="child"
                :id="'child_' + index"
                style="visibility: collapse"
              >
                <td class="child" :colspan="state.columns.length">
                  <slot name="childCollapsed" :item="item" />
                </td>
              </tr>
              <tr v-if="!paginatedItems.length">
                <td :colspan="state.columns.length" class="dataTables_empty" valign="top">
                  <Spinner :loading="loadingState"></Spinner>
                  <span v-if="isDataEmpty">No data available in table</span>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot v-if="paginatedItems.length">
            <slot name="tableFooter"></slot>
          </tfoot>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-5" v-if="props.table_pagination">
        <div class="dataTables_info" id="datatable_info" role="status" aria-live="polite">
          <span class="page-stats">Showing {{ entriesRange }} entries</span>
        </div>
      </div>
      <div class="col-sm-12 col-md-7 d-flex justify-content-end" v-if="props.table_pagination">
        <div
          :class="totalPages >= 10 ? 'paging_simple_numbers' : 'paging_full_numbers'"
          class="dataTables_paginate"
          id="datatable_paginate"
        >
          <ul class="pagination">
            <li class="paginate_button page-item previous">
              <button
                @click="prevPage"
                class="page-link"
                data-dt-idx="0"
                tabindex="0"
                :style="'cursor:' + (state.currentPage === 1 ? ' default;' : ' pointer;')"
              >
                Previous
              </button>
            </li>
            <template v-if="totalPages <= 10">
              <li class="paginate_button page-item" v-for="pageNumber in pages" :key="pageNumber">
                <button
                  @click="goToPage(pageNumber)"
                  class="page-link"
                  data-dt-idx="2"
                  tabindex="0"
                  :class="{ active: pageNumber === state.currentPage }"
                  :style="
                    'cursor:' + (pageNumber === state.currentPage ? ' default;' : ' pointer;')
                  "
                >
                  {{ pageNumber }}
                </button>
              </li>
            </template>
            <template v-else>
              <li v-if="ellipsisPages.start > 1" class="paginate_button page-item">
                <button
                  @click="goToPage(1)"
                  class="page-link"
                  data-dt-idx="2"
                  tabindex="0"
                  :class="{ active: 1 === state.currentPage }"
                  :style="'cursor:' + (1 === state.currentPage ? ' default;' : ' pointer;')"
                >
                  1
                </button>
              </li>
              <li v-if="ellipsisPages.start > 1">
                <span class="page-link">...</span>
              </li>
              <li
                class="paginate_button page-item"
                v-for="pageNumber in ellipsisPages.range"
                :key="pageNumber"
              >
                <button
                  @click="goToPage(pageNumber)"
                  class="page-link"
                  data-dt-idx="2"
                  tabindex="0"
                  :class="{ active: pageNumber === state.currentPage }"
                  :style="
                    'cursor:' + (pageNumber === state.currentPage ? ' default;' : ' pointer;')
                  "
                >
                  {{ pageNumber }}
                </button>
              </li>
              <li v-if="ellipsisPages.end < totalPages">
                <span class="page-link" style="pointer-events: none">...</span>
              </li>
              <li v-if="ellipsisPages.end < totalPages" class="paginate_button page-item">
                <button
                  @click="goToPage(totalPages)"
                  class="page-link"
                  data-dt-idx="2"
                  tabindex="0"
                  :class="{ active: totalPages === state.currentPage }"
                  :style="
                    'cursor:' + (totalPages === state.currentPage ? ' default;' : ' pointer;')
                  "
                >
                  {{ totalPages }}
                </button>
              </li>
            </template>
            <li class="paginate_button page-item next">
              <button
                @click="nextPage"
                class="page-link"
                data-dt-idx="8"
                tabindex="0"
                :style="'cursor:' + (state.currentPage === totalPages ? ' default;' : ' pointer;')"
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div ref="copyInfo" id="datatables_buttons_info" class="dt-button-info" style="display: none">
    <h2>Copy to clipboard</h2>
    <div>Copied {{ paginatedItems.length }} rows to clipboard</div>
  </div>
  <Offcanvas title="Track Shipment" :fetchParams="{ param: selectedItem }" ref="offcanvasRef" />
</template>
