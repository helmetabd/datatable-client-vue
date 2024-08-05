export function calculateGrowth(target: number, actual: number) {
  if (target != 0 && actual != 0 && target != null) {
    const res = ((actual - target) / target) * 100
    // return res
    return responseCalculate(res)
  } else {
    return responseCalculate(-100)
  }
}
export function calculatePercentage(current: number, total: number) {
  if (total != 0 && current != 0 && total != null) {
    const res = (current / total) * 100
    return res.toFixed(2)
  } else {
    return 0
  }
}
export function responseCalculate(data: number) {
  if (data != -100 && data) {
    return {
      status: true,
      success: data > 0 ? 'success' : 'danger',
      result: data < 0 ? (data * -1).toFixed(2) : data.toFixed(2),
      arrow: data > 0 ? 'up' : 'down'
    }
  } else {
    return {
      status: false,
      success: 'danger',
      result: 0,
      arrow: 'down'
    }
  }
}
const separator = (num: number | string) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
export function fixedNumberFormatter(num: string | number, fixed: number) {
  if (fixed != null) {
    return separator(Number(num).toFixed(fixed).replace('.', ','))
  } else {
    return separator(Number(num).toFixed(2).replace('.', ','))
  }
}
export function formatMoneyShort(num: number) {
  if (num > 1000000 && num < 900000000) {
    num = Math.round(num / 1000000)
    return 'Rp.' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'JT'
  } else if (num >= 1000000000) {
    num = Math.round(num / 1000000000)
    return 'Rp.' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'M'
  }
}
