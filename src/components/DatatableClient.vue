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
<style lang="scss">
@import '../assets/scss/config/default/app.scss';
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
import type { Column, FormField, Props, RenderColumn } from '@/interfaces'

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

const loading = computed(() => {
  if (filteredItems.value.length === 0) {
    return true
  } else {
    return false
  }
})

const filteredItems = computed(() => {
  if (!state.filter) {
    return props.dataTable
  }

  return props.dataTable.filter((item: FormField) => {
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
  return filterData.slice().sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
    let aValue = a[sortingKey]
    let bValue = b[sortingKey]

    const column = state.columns.find((column: { name: any }) => column.name === sortingKey)

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
  return sortedItems.value.length ? sortedItems.value.slice(start, end) : []
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
  const totalVisiblePages = 3
  let range = []
  let start, end

  if (totalPages.value <= totalVisiblePages) {
    start = 1
    end = totalPages.value
  } else {
    const pagesBeforeCurrent = 1
    const pagesAfterCurrent = 1

    if (state.currentPage <= pagesBeforeCurrent + 1) {
      start = 1
      end = totalVisiblePages
    } else if (state.currentPage + pagesAfterCurrent >= totalPages.value) {
      start = totalPages.value - totalVisiblePages + 1
      end = totalPages.value
    } else {
      start = state.currentPage - pagesBeforeCurrent
      end = state.currentPage + pagesAfterCurrent
    }
  }

  if (start > 1) {
    range.push(1)
    if (start > 2) {
      range.push('...')
    }
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  if (end < totalPages.value) {
    if (end < totalPages.value - 1) {
      range.push('...')
    }
    range.push(totalPages.value)
  }

  return { start, end, range }
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
  const column = state.columns.find((column: { name: string }) => column.name === key)
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
  return 'sorting_disabled'
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

function lightOrDark(color: any | any[]) {
  // Check the format of the color, HEX or RGB?
  let r, g, b, hsp
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    r = color[1];
    g = color[2];
    b = color[3];
  }
  else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'
    ));
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }
  // HSP equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );
  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return 'light';
  }
  else {
    return 'dark';
  }
}

const tableData = ref<HTMLElement | null>(null)
const copyInfo = ref<HTMLElement | null>(null)

const renderCellContent = (item: any, column: Column) => {
  if (column.isNumber) {
    const value = getObjectValue(item, column.name)
    const formattedValue = value ? column.fixedNumber
      ? value?.toFixed(column.fixedNumber).replace('.', ',')
      : thousandSeparator(value) : 0
    return formattedValue
  } else if (column.percentage) {
    const growth = calculateGrowth(
      getObjectValue(item, column.percentage.target),
      getObjectValue(item, column.percentage.actual)
    )
    return {
      component: 'PercentageBadge',
      props: {
        label: growth.result,
        status: growth.success
      }
    }
  } else if (column.custom) {
    let returnData = { text: getObjectValue(item, column.custom.display ?? column.name) } as RenderColumn
    if (column.custom.routeName) {
      const valueColumn = getObjectValue(item, column.name)
      returnData = {
        ...returnData,
        component: 'router-link',
        props: {
          to: {
            name: column.custom.routeName,
            params: {
              id: column.isFirst
                ? getObjectValue(valueColumn[0], column.custom.params)
                : column.isLast
                  ? getObjectValue(
                    valueColumn[valueColumn.length - 1],
                    column.custom.params
                  )
                  : getObjectValue(item, column.custom.params)
            }
          }
        },
      }
    }
    if (column.custom.image) {
      returnData.imageSrc = avatar(getObjectValue(item, column.custom.image))
    }
    if (column.custom.icon) {
      returnData.iconClass = column.custom.icon
      if (column.custom.iconColorObject) {
        returnData.iconColorObject = getObjectValue(item, column.custom.iconColorObject)
      }
      if (column.custom.iconColor) {
        returnData.iconColor = column.custom.iconColor
      }
    }
    if (column.custom.uniqueFirst && getObjectValue(item, column.custom.uniqueFirst.fields) === column.custom.uniqueFirst.value) {
      returnData.uniqueFirst = column.custom.uniqueFirst.icon
    }
    if (column.custom.parent && getObjectValue(item, column.custom.parent.data) !== null && getObjectValue(item, column.custom.parent.params) !== getObjectValue(item, column.custom.params)) {
      returnData.parent.props.to = {
        name: column.custom.parent.routeName,
        params: {
          id: getObjectValue(item, column.custom.parent.params)
        }
      }
      returnData.parent.text = getObjectValue(item, column.custom.parent.name)
      if (column.custom.parent.icon) {
        returnData.parent.iconClass = column.custom.parent.icon
      } else {
        returnData.parent.iconClass = column.custom.icon
      }
      if (column.custom.parent.iconColorObject) {
        returnData.parent.iconColorObject = getObjectValue(item, column.custom.parent.iconColorObject)
      }
      if (column.custom.parent.iconColor) {
        returnData.parent.iconColor = column.custom.parent.iconColor
      }
    }
    // console.log(returnData)
    return returnData
  } else if (column.badge) {
    const columnValue = getObjectValue(item, column.name)
    const generateBadge = (value: any) => ({
      class: `badge bg-${column.badge?.type || 'default'}-subtle text-${column.badge?.textColor || 'default'} p-2`,
      style: column.badge?.custom ? `background-color: ${getObjectValue(item, column.badge.color)};` : '',
      text: value,
    });

    // Function to handle badges without `badge.types` for array data
    const handleBadgesForArray = (array: any[]) => {
      return array.map((arrayItem: any) => generateBadge(getObjectValue(arrayItem, column.badge.display)));
    };

    // Function to handle badges with `badge.types` for both array and non-array data
    const handleBadgesWithTypes = (value: any) => {
      return column.badge.types
        .filter((model: any) => model.value === value)  // Match badge types
        .map((model: any) => ({
          class: column.badge.custom
            ? `badge text-${model.textColor}`
            : `badge bg-${model.type}-subtle text-${model.type} p-2`,
          style: column.badge.custom ? `background-color: ${model.color};` : '',
          text: model.label || value,
        }));
    };

    // Case 1: Handle array data
    if (Array.isArray(columnValue)) {
      // Sub-case 1: No `badge.types`, just generate default badges for array items
      if (!column.badge?.types) {
        return handleBadgesForArray(columnValue);  // Default badge generation for array
      }
      // Sub-case 2: Use `badge.types` for array items
      else {
        return columnValue
          .flatMap((arrayItem: any) => handleBadgesWithTypes(getObjectValue(arrayItem, column.badge.display)));
      }
    }

    // Case 2: Handle non-array data
    if (!column.badge?.types) {
      // Sub-case 1: No `badge.types` and data is not an array -> default badge for single value
      return [generateBadge(columnValue)];  // Default badge generation for single value
    } else {
      // Sub-case 2: Use `badge.types` for single value
      return handleBadgesWithTypes(columnValue);
    }
  } else if (column.dateConfig) {
    const formattedDate = formatDate(
      getObjectValue(item, column.display ?? column.name),
      column.dateConfig.before,
      column.dateConfig.after
    )
    if (column.routeName && column.params) {
      return {
        component: 'router-link',
        props: {
          to: {
            name: column.routeName,
            params: { id: getObjectValue(item, column.params.id) },
            query: { date: getObjectValue(item, column.params.date) }
          }
        },
        text: formattedDate
      }
    }
    return formattedDate
  } else if (column.offcanvas) {
    return {
      buttonText: getObjectValue(item, column.name),
      onClick: () =>
        openOffcanvas({
          courier: getObjectValue(item, column.offcanvas.courier),
          tracking_number: getObjectValue(item, column.name)
        })
    }
  } else if (column.stackedImage) {
    return {
      component: 'StackedAvatar',
      props: { collections: getObjectValue(item, column.name) }
    }
  } else if (column.isArray) {
    const columnValue = getObjectValue(item, column.name)
    return column.isFirst
      ? getObjectValue(columnValue[0], column.display)
      : column.isLast
        ? getObjectValue(columnValue[columnValue.length - 1], column.display)
        : formatObjectArray(columnValue, column.display)
  } else if (column.defaultValue) {
    return getObjectValue(item, column.name, column.defaultValue)
  } else if (column.color) {
    const colorValue = getObjectValue(item, column.name)
    return {
      component: 'ColorDiv',
      props: {
        textColor: lightOrDark(colorValue) == 'light' ? 'text-dark' : 'text-light',
        text: colorValue
      }
    }
  } else if (column.customizeRow) {
    // Customization handled by the slot in the template
    return null
  } else {
    return getObjectValue(item, column.name)
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

const exportToExcel = () => {
  // Backup current page and size
  const originalPageSize = state.pageSize
  const originalCurrentPage = state.currentPage

  // Set pageSize to a large number to include all items in the export
  state.pageSize = sortedItems.value.length
  state.currentPage = 1

  // Wait for reactivity to update the paginated items
  setTimeout(() => {
    if (tableData.value) {
      const ws = XLSX.utils.aoa_to_sheet(generateExportData())
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, `${props.copyTitle ?? 'Report'}.xlsx`)

      // Restore original state
      state.pageSize = originalPageSize
      state.currentPage = originalCurrentPage
    }
  }, 0)
}

const generateExportData = () => {
  const headers = state.columns.map((column: { label: any }) => column.label)
  const data = sortedItems.value.map((item: any) => {
    return state.columns.map((column: Column) => renderExportCellContent(item, column))
  })

  return [headers, ...data]
}

const renderExportCellContent = (item: any, column: Column) => {
  const content = renderCellContent(item, column)
  // console.log(content)

  if (typeof content === 'string') {
    return content
  } else if (content?.component === 'router-link') {
    if (content?.parent) {
      return `${content.parent.text} &rarr; ${content.text}`
    } else {
      return content.text
    }
  } else if (content?.component === 'PercentageBadge') {
    return `${content.props.label} (${content.props.status ? '↑' : '↓'})`
  } else if (content?.imageSrc) {
    return content.text // Return text associated with the image for Excel
  } else if (Array.isArray(content)) {
    return content.map((badge) => badge.text).join(', ') // Join multiple badges
  } else if (content?.component === 'StackedAvatar') {
    return content.props.collections.join(', ') // Join stacked avatar data
  } else if (content?.buttonText) {
    return content.buttonText
  } else if (typeof content == 'object' && content !== null) {
    if (content?.parent) {
      return `${content.parent.text} &rarr; ${content.text}`
    } else {
      return content.text
    }
  } else {
    return content
  }
}

const printTable = () => {
  const originalPageSize = state.pageSize
  const originalCurrentPage = state.currentPage

  const totalPages = Math.ceil(sortedItems.value.length / originalPageSize)

  // Wait for reactivity to update the paginated items
  setTimeout(() => {
    if (tableData.value) {
      const printWindow = window.open('', '_blank')
      let printContent = ''

      for (let i = 1; i <= totalPages; i++) {
        state.currentPage = i
        const pageContent = generatePrintContent()
        printContent += `
          <div>
            <h3>${props.copyTitle ?? 'Print'} - Page ${i}</h3>
            ${pageContent}
          </div>
          ${i < totalPages ? '<div style="page-break-after: always;"></div>' : ''}
        `
      }

      if (printWindow) {
        printWindow.document.write(`
          <html>
          <head>
            <title>${props.copyTitle ?? 'Print'}</title>
            <style>
              body { font-family: Arial, sans-serif; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; }
              th { background-color: #f2f2f2; text-align: left; }
              .badge { padding: 4px; font-size: 10px; }
              @media print {
                div { page-break-inside: avoid; }
                table { page-break-inside: auto; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }

      // Restore original state
      state.pageSize = originalPageSize
      state.currentPage = originalCurrentPage
    }
  }, 0)
}

const generatePrintContent = () => {
  const tableHtml = `
    <table>
      <thead>
        <tr>
          ${state.columns.map((column: { label: any }) => `<th>${column.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${paginatedItems.value
      .map(
        (item: any) => `
          <tr>
            ${state.columns
            .map(
              (column: Column) => `
              <td>
                ${renderPrintCellContent(item, column)}
              </td>
            `
            )
            .join('')}
          </tr>
        `
      )
      .join('')}
      </tbody>
    </table>
  `
  return tableHtml
}

const renderPrintCellContent = (item: any, column: Column) => {
  const content = renderCellContent(item, column)

  if (typeof content === 'string') {
    return content
  } else if (content?.component === 'router-link') {
    if (content?.parent) {
      return `${content.parent.text} &rarr; ${content.text}`
    } else {
      return content.text
    }
  } else if (content?.component === 'PercentageBadge') {
    return `${content.props.label} (${content.props.status ? '↑' : '↓'})`
  } else if (content?.imageSrc) {
    return `<img src="${content.imageSrc}" class="rounded-circle avatar-xxs me-2" /> ${content.text}`
  } else if (Array.isArray(content)) {
    return content
      .map((badge) => `<span class="${badge.class}" style="${badge.style}">${badge.text}</span>`)
      .join('')
  } else if (content?.component === 'StackedAvatar') {
    // Handle stacked avatar in a simple way for print, e.g., list of names or initials
    return content.props.collections.join(', ')
  } else if (content?.buttonText) {
    return content.buttonText
  } else if (typeof content === 'object' && content !== null) {
    if (content?.parent) {
      return `${content.parent.text} &rarr; ${content.text}`
    } else {
      return content.text
    }
  } else {
    return content
  }
}

onMounted(() => {
  if (loading.value) {
    setTimeout(() => {
      isDataEmpty.value = true
      loadingState.value = false
    }, 3000)
  }
})
</script>
<template>
  <div class="dataTables_wrapper dt-bootstrap5 no-footer">
    <div class="row ">
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_length" v-if="props.table_show">
          <label>
            Show
            <select v-model="state.pageSize" id="pageSize" aria-controls="datatable" class="form-select form-select-sm">
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
          <label for="filter">Search:<input type="search" v-model="state.filter" id="filter"
              class="form-control form-control-sm" aria-controls="datatable" />
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="dt-buttons" v-if="props.buttons">
        <button v-if="props.buttons.copy" class="dt-button buttons-copy buttons-html5" tabindex="0" type="button"
          id="copyButton" @click="copyToClipboard">
          <span>Copy</span>
        </button>
        <button v-if="props.buttons.excel" class="dt-button buttons-excel buttons-html5" tabindex="0" type="button"
          @click="exportToExcel">
          <span>Excel</span>
        </button>
        <button v-if="props.buttons.print" class="dt-button buttons-print" tabindex="0" type="button"
          @click="printTable">
          <span>Print</span>
        </button>
      </div>
      <div style="overflow-x: auto; overflow-y: hidden;">
        <table ref="tableData" id="datatable"
          class="table table-hover table-bordered align-middle text-nowrap dt-responsive nowrap no-footer dataTable"
          :class="props.collapsed ? 'dtr-inline collapsed' : props.table_class" style="width: 100%"
          aria-describedby="datatable_info">
          <thead class="align-middle">
            <tr v-if="group">
              <th v-for="group in state.groupHeader" :colspan="group.colspan" :key="group.title" :class="group.class">
                {{ group.title }}
              </th>
            </tr>
            <tr :class="props.headerRowClass">
              <th v-for="(column, index) in state.columns" :key="index" @click="toggleSorting(column)" :style="'width:' +
                column.width +
                '; cursor:' +
                (column.sortable ? ' pointer;' : ' default;')
                " :class="checkIcon(column) + ' ' + column.headerClass" :hidden="column.hidden ?? false"
                aria-controls="datatable">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in paginatedItems" :key="index">
              <tr :id="'row_' + index" :class="props.customRow && getObjectValue(item, props.customRow.value)
                ? props.customRow.class
                : ''
                ">
                <td v-for="(column, columnIndex) in state.columns" :key="columnIndex"
                  :class="column.targetCollapsed ? 'dtr-control' : '' + column.bold ? 'fw-semibold ' : 'fw-normal '"
                  @click="column.targetCollapsed && toggleCollapsed(index)" :hidden="column.hidden ?? false">
                  <div :class="column.class">
                    <!-- Use the slot for customizeRow -->
                    <template v-if="column.customizeRow">
                      <slot :name="`column-${column.name}`" :item="item" />
                    </template>
                    <!-- Render content based on the type returned by renderCellContent -->
                    <template v-else>
                      <span style="float: left" v-if="column.currency">{{ column.currency }}</span>
                      <span
                        v-if="typeof renderCellContent(item, column) == 'string' || typeof renderCellContent(item, column) == 'number'">
                        {{ renderCellContent(item, column) }}
                      </span>
                      <PercentageBadge v-else-if="renderCellContent(item, column)?.component === 'PercentageBadge'"
                        :label="renderCellContent(item, column).props.label"
                        :status="renderCellContent(item, column).props.status" />
                      <template v-else-if="renderCellContent(item, column)?.component === 'router-link'">
                        <template v-if="renderCellContent(item, column)?.parent">
                          <router-link :to="renderCellContent(item, column).parent.props.to">
                            <i v-if="renderCellContent(item, column)?.parent?.iconClass"
                              :class="renderCellContent(item, column).parent.iconClass" :style="renderCellContent(item, column)?.parent?.iconColorObject ? 'color: ' +
                                renderCellContent(item, column).parent.iconColorObject +
                                ';'
                                : renderCellContent(item, column)?.parent?.iconColor
                                  ? 'color: ' + renderCellContent(item, column).parent.iconColor + ';'
                                  : null
                                "></i>
                            {{ renderCellContent(item, column).parent.text }}
                          </router-link>
                          <i class="las la-arrow-right ms-1 me-1 text-muted"></i>
                        </template>
                        <router-link :to="renderCellContent(item, column).props.to">
                          <img v-if="renderCellContent(item, column)?.imageSrc"
                            :src="renderCellContent(item, column).imageSrc" class="rounded-circle avatar-xxs me-2" />
                          <i v-if="renderCellContent(item, column)?.iconClass"
                            :class="renderCellContent(item, column)?.iconClass" :style="renderCellContent(item, column)?.iconColorObject ? 'color: ' +
                              renderCellContent(item, column)?.iconColorObject +
                              ';'
                              : renderCellContent(item, column)?.iconColor
                                ? 'color: ' + renderCellContent(item, column)?.iconColor + ';'
                                : null
                              "></i>
                          {{ renderCellContent(item, column).text }}
                          <i v-if="renderCellContent(item, column)?.uniqueFirst"
                            :class="renderCellContent(item, column)?.uniqueFirst"></i>
                          <template v-if="column.custom.uniqueIcon">
                            <slot :name="`column-${column.name}-unique`" :item="item" />
                          </template>
                        </router-link>
                      </template>
                      <StackedAvatar v-else-if="renderCellContent(item, column)?.component === 'StackedAvatar'"
                        :collections="renderCellContent(item, column).props.collections" />
                      <button v-else-if="renderCellContent(item, column)?.buttonText" class="btn btn-light btn-sm"
                        type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightTrial"
                        aria-controls="offcanvasRightTrial" @click="renderCellContent(item, column).onClick">
                        {{ renderCellContent(item, column).buttonText }}
                      </button>
                      <template v-else-if="Array.isArray(renderCellContent(item, column))">
                        <span v-for="badge in renderCellContent(item, column)" :key="badge.text" :class="badge.class"
                          :style="badge.style">
                          {{ badge.text }}
                        </span>
                      </template>
                      <span v-else-if="renderCellContent(item, column)?.class"
                        :class="renderCellContent(item, column).class" :style="renderCellContent(item, column).style">
                        {{ renderCellContent(item, column).text }}
                      </span>
                      <div v-else-if="renderCellContent(item, column)?.component === 'ColorDiv'">
                        <div :style="{ backgroundColor: renderCellContent(item, column).text }" class="p-1 rounded-2">
                          <span :class="renderCellContent(item, column).textColor">
                            {{ renderCellContent(item, column).text }}
                          </span>
                        </div>
                      </div>
                      <span v-else>
                        <img v-if="renderCellContent(item, column)?.imageSrc"
                          :src="renderCellContent(item, column).imageSrc" class="rounded-circle avatar-xxs me-2" />
                        <i v-if="renderCellContent(item, column)?.iconClass"
                          :class="renderCellContent(item, column)?.iconClass"></i>
                        {{ renderCellContent(item, column)?.text }}
                        <i v-if="renderCellContent(item, column)?.uniqueFirst"
                          :class="renderCellContent(item, column)?.uniqueFirst"></i>
                        <template v-if="column.custom.uniqueIcon">
                          <slot :name="`column-${column.name}-unique`" :item="item" />
                        </template>
                      </span>
                    </template>
                  </div>
                </td>
              </tr>
              <tr v-if="props.collapsed" class="child" :id="'child_' + index" style="visibility: collapse">
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
        <div class="dataTables_info" id="datatable_info" role="status" aria-live="polite"
          :class="props.paginationClass">
          <span class="page-stats">Showing {{ entriesRange }} entries</span>
        </div>
      </div>
      <div class="col-sm-12 col-md-7 d-flex justify-content-end" v-if="props.table_pagination">
        <div :class="totalPages >= 10 ? 'paging_simple_numbers' : 'paging_full_numbers'" class="dataTables_paginate"
          id="datatable_paginate">
          <ul class="pagination">
            <li class="paginate_button page-item previous">
              <button @click="prevPage" class="page-link" data-dt-idx="0" tabindex="0"
                :style="'cursor:' + (state.currentPage === 1 ? ' default;' : ' pointer;')">
                Previous
              </button>
            </li>
            <template v-if="totalPages <= 10">
              <li class="paginate_button page-item" v-for="pageNumber in pages" :key="pageNumber">
                <button @click="goToPage(pageNumber)" class="page-link" data-dt-idx="2" tabindex="0"
                  :class="{ active: pageNumber === state.currentPage }" :style="'cursor:' + (pageNumber === state.currentPage ? ' default;' : ' pointer;')
                    ">
                  {{ pageNumber }}
                </button>
              </li>
            </template>
            <template v-else>
              <template v-for="pageNumber in ellipsisPages.range" :key="pageNumber">
                <li class="paginate_button page-item" v-if="pageNumber !== '...'">
                  <button v-if="typeof pageNumber == 'number'" @click="goToPage(pageNumber)" class="page-link"
                    data-dt-idx="2" tabindex="0" :class="{ active: pageNumber === state.currentPage }" :style="'cursor:' + (pageNumber === state.currentPage ? ' default;' : ' pointer;')
                      ">
                    {{ pageNumber }}
                  </button>
                </li>
                <li v-else>
                  <span class="page-link" style="pointer-events: none">...</span>
                </li>
              </template>
            </template>
            <li class="paginate_button page-item next">
              <button @click="nextPage" class="page-link" data-dt-idx="8" tabindex="0"
                :style="'cursor:' + (state.currentPage === totalPages ? ' default;' : ' pointer;')">
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
