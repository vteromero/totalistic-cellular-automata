// https://mathworld.wolfram.com/TotalisticCellularAutomaton.html

// The maximum is exclusive and the minimum is inclusive
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

// The maximum is inclusive and the minimum is inclusive
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const shuffle = (arr) => (
  arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
)

const totalisticStates = (colors) => 3 * colors - 2

const maxState = (colors) => colors - 1

const tableStrRegexp = (colors) => (
  new RegExp(`^[0-${maxState(colors)}]{${totalisticStates(colors)}}$`)
)

const tableStrToArray = (colors) => (str) => {
  const re = tableStrRegexp(colors)

  if (!re.test(str)) return null

  return str.split('').map(c => Number(c))
}

const tableArrayToStr = (arr) => arr.join('')

const randomTable = (colors) => () => (
  Array.from({length: totalisticStates(colors)}, () => getRandomIntInclusive(0, maxState(colors)))
)

const randomBalancedTable = (colors) => () => {
  const states = Array.from({length: colors}, (_, i) => ({ value: i, count: 1 }))
  const shuffledStates = shuffle(states)
  let remaining = totalisticStates(colors) - colors

  shuffledStates.slice(1).forEach((stateObj) => {
    const inc = getRandomIntInclusive(0, remaining)
    stateObj.count += inc
    remaining -= inc
  })
  shuffledStates[0].count += remaining

  const table = shuffledStates.flatMap(stateObj => (
    new Array(stateObj.count).fill(stateObj.value)
  ))

  return shuffle(table)
}

const PALETTE_SEPARATOR = '_'

const paletteColorRegexp = new RegExp('^([0-9]|[a-f]){6}$')

const testPaletteStr = (colors) => (str) => {
  if (str === null) return false

  const paletteColors = str.split(PALETTE_SEPARATOR)

  if (paletteColors.length !== colors) return false

  return paletteColors.every(colorStr => paletteColorRegexp.test(colorStr))
}

const paletteStrToArray = (colors) => (str) => {
  if (!testPaletteStr(colors)(str)) return null

  return str.split(PALETTE_SEPARATOR).map(paletteColor => `#${paletteColor}`)
}

const paletteArrayToStr = (arr) => arr.map(colorHex => (colorHex.substring(1))).join(PALETTE_SEPARATOR)

const randomPaletteColor = () => {
  const n = Math.floor(Math.random() * 16777215)
  const hex = n.toString(16)
  const paddedHex = hex.padStart(6, '0')

  return '#' + paddedHex
}

const randomPalette = (colors) => () => (
  Array.from({length: colors}, () => randomPaletteColor())
)

const rowStrRegexp = (colors) => (
  new RegExp(`^[0-${maxState(colors)}]+$`)
)

const rowStrToArray = (colors) => (str) => {
  const re = rowStrRegexp(colors)

  if (!re.test(str)) return null

  return str.split('').map(c => Number(c))
}

const rowArrayToStr = (arr) => arr.join('')

const randomRow = (colors) => (len) => (
  Array.from({length: len}, () => getRandomInt(0, colors))
)

const newRow = (row, table) => {
  const len = row.length

  return row.map((cur, i) => {
    const prev = (i > 0) ? row[i - 1] : row[len - 1]
    const next = (i < (len - 1)) ? row[i + 1] : row[0]
    const sum = prev + cur + next

    return table[sum]
  })
}

const createGrid = (rows, table, firstRow) => {
  let row = firstRow
  let grid = []

  for(let r = 0; r < rows; r++) {
    grid.push(row)
    row = newRow(row, table)
  }

  return grid
}

const drawGrid = (canvas, grid, cellSize, palette) => {
  const ctx = canvas.getContext('2d')

  grid.forEach((row, r) => {
    row.forEach((val, c) => {
      const x = c * cellSize
      const y = r * cellSize

      ctx.fillStyle = palette[val]
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  })
}

export const totatlisticCellularAutomatonFunctions = (colors) => (
  {
    tableStrToArray: tableStrToArray(colors),
    tableArrayToStr: tableArrayToStr,
    randomTable: randomTable(colors),
    randomBalancedTable: randomBalancedTable(colors),
    paletteStrToArray: paletteStrToArray(colors),
    paletteArrayToStr: paletteArrayToStr,
    randomPalette: randomPalette(colors),
    rowStrToArray: rowStrToArray(colors),
    rowArrayToStr: rowArrayToStr,
    randomRow: randomRow(colors),
    createGrid: createGrid,
    drawGrid: drawGrid
  }
)

export const resizeCanvas = (canvas, width, height) => {
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = width
  canvas.height = height
}

export const automatonPermalinkURL = (baseUrl, props) => {
  let url = new URL(baseUrl)
  let searchParams = new URLSearchParams()

  searchParams.set('colors', props.colors)
  searchParams.set('cellSize', props.cellSize)
  searchParams.set('rows', props.rows)
  searchParams.set('columns', props.columns)
  searchParams.set('table', props.funcs.tableArrayToStr(props.table))
  searchParams.set('palette', props.funcs.paletteArrayToStr(props.palette))
  searchParams.set('firstRow', props.funcs.rowArrayToStr(props.firstRow))

  url.search = searchParams.toString()
  url.hash = ''

  return url
}
