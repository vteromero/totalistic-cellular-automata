import {
  resizeCanvas,
  createTotatlisticCellularAutomaton
} from './lib.js'

const DEFAULT_COLORS      = 4
const DEFAULT_ROWS        = 150
const DEFAULT_COLUMNS     = 150
const DEFAULT_CELL_SIZE   = 5

const parseColorsParam = (colors) => (
  Number(colors) || DEFAULT_COLORS
)

const parseRowsParam = (rows) => (
  Number(rows) || DEFAULT_ROWS
)

const parseColumnsParam = (columns) => (
  Number(columns) || DEFAULT_COLUMNS
)

const parseCellSizeParam = (cellSize) => (
  Number(cellSize) || DEFAULT_CELL_SIZE
)

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search)

  const colors = parseColorsParam(urlParams.get('colors'))
  const automaton = createTotatlisticCellularAutomaton(colors)

  const rows = parseRowsParam(urlParams.get('rows'))
  const columns = parseColumnsParam(urlParams.get('columns'))
  const cellSize = parseCellSizeParam(urlParams.get('cellSize'))
  const table = automaton.tableStrToArray(urlParams.get('table')) || automaton.randomBalancedTable()
  const palette = automaton.paletteStrToArray(urlParams.get('palette')) || automaton.randomPalette()

  const firstRow = automaton.randomRow(columns)
  const grid = automaton.createGrid(rows, table, firstRow)

  const canvas = document.getElementById('canvas')
  const width = columns * cellSize
  const height = rows * cellSize

  resizeCanvas(canvas, width, height)

  automaton.drawGrid(canvas, grid, cellSize, palette)

  console.log('colors:', colors)
  console.log('rows:', rows)
  console.log('columns:', columns)
  console.log('cellSize:', cellSize)
  console.log('table:', table.join(''))
  console.log('palette:', palette.join(','))
})
