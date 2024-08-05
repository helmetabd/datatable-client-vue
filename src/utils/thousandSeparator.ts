export default function formatNumber(num: number | string | null | undefined): string | number {
  if (num) {
    let str = num.toString().replace('$', '')
    let parts: string[] | false = false
    const output: string[] = []
    let i = 1
    let formatted: string | null = null

    if (str.indexOf(',') > 0) {
      parts = str.split(',')
      str = parts[0]
    }

    str = str.split('').reverse().join('')
    for (let j = 0, len = str.length; j < len; j++) {
      if (str[j] !== '.') {
        output.push(str[j])
        if (i % 3 === 0 && j < len - 1) {
          output.push('.')
        }
        i++
      }
    }

    formatted = output.reverse().join('')
    return formatted + (parts ? ',' + parts[1].substr(0, 2) : '')
  } else {
    return 0
  }
}
