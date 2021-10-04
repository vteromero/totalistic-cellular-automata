import {
  resizeCanvas,
  totatlisticCellularAutomatonFunctions
} from './lib.js'

const COLORS_MIN          = 2
const COLORS_MAX          = 10
const COLORS_DEFAULT      = 4
const ROWS_MIN            = 10
const ROWS_MAX            = 1000
const ROWS_DEFAULT        = 150
const COLUMNS_MIN         = 10
const COLUMNS_MAX         = 1000
const COLUMNS_DEFAULT     = 150
const CELL_SIZE_MIN       = 1
const CELL_SIZE_MAX       = 20
const CELL_SIZE_DEFAULT   = 5

const parseColorsParam = (colors) => {
  const n = parseInt(colors)

  if (Number.isNaN(n)) return COLORS_DEFAULT
  if (n < COLORS_MIN) return COLORS_MIN
  if (n > COLORS_MAX) return COLORS_MAX

  return n
}

const parseCellSizeParam = (cellSize) => {
  const n = parseInt(cellSize)

  if (Number.isNaN(n)) return CELL_SIZE_DEFAULT
  if (n < CELL_SIZE_MIN) return CELL_SIZE_MIN
  if (n > CELL_SIZE_MAX) return CELL_SIZE_MAX

  return n
}

const parseRowsParam = (rows) => {
  const n = parseInt(rows)

  if (Number.isNaN(n)) return ROWS_DEFAULT
  if (n < ROWS_MIN) return ROWS_MIN
  if (n > ROWS_MAX) return ROWS_MAX

  return n
}

const parseColumnsParam = (columns) => {
  const n = parseInt(columns)

  if (Number.isNaN(n)) return COLUMNS_DEFAULT
  if (n < COLUMNS_MIN) return COLUMNS_MIN
  if (n > COLUMNS_MAX) return COLUMNS_MAX

  return n
}

const parseTableParam = (table, automatonFuncs) => (
  automatonFuncs.tableStrToArray(table) || automatonFuncs.randomBalancedTable()
)

const parsePaletteParam = (palette, automatonFuncs) => (
  automatonFuncs.paletteStrToArray(palette) || automatonFuncs.randomPalette()
)

const generateAutomatonFromUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)

  const colors = parseColorsParam(urlParams.get('colors'))
  const automatonFuncs = totatlisticCellularAutomatonFunctions(colors)

  const cellSize = parseCellSizeParam(urlParams.get('cellSize'))
  const rows = parseRowsParam(urlParams.get('rows'))
  const columns = parseColumnsParam(urlParams.get('columns'))
  const table = parseTableParam(urlParams.get('table'), automatonFuncs)
  const palette = parsePaletteParam(urlParams.get('palette'), automatonFuncs)

  const firstRow = automatonFuncs.randomRow(columns)
  const grid = automatonFuncs.createGrid(rows, table, firstRow)

  const canvas = document.getElementById('canvas')
  const width = columns * cellSize
  const height = rows * cellSize

  resizeCanvas(canvas, width, height)

  automatonFuncs.drawGrid(canvas, grid, cellSize, palette)

  return { colors, cellSize, rows, columns, table, palette }
}

const generateAutomatonFromForm = () => {
  const colors = parseColorsParam(document.querySelector('#colors').value)
  const automatonFuncs = totatlisticCellularAutomatonFunctions(colors)

  const cellSize = parseCellSizeParam(document.querySelector('#cell-size').value)
  const rows = parseRowsParam(document.querySelector('#rows').value)
  const columns = parseColumnsParam(document.querySelector('#columns').value)
  const table = parseTableParam(document.querySelector('#table').value, automatonFuncs)
  const palette = automatonFuncs.randomPalette()

  const firstRow = automatonFuncs.randomRow(columns)
  const grid = automatonFuncs.createGrid(rows, table, firstRow)

  const canvas = document.getElementById('canvas')
  const width = columns * cellSize
  const height = rows * cellSize

  resizeCanvas(canvas, width, height)

  automatonFuncs.drawGrid(canvas, grid, cellSize, palette)

  return { colors, cellSize, rows, columns, table, palette }
}

const logAutomatonProps = (props) => {
  console.log('colors:', props.colors)
  console.log('cellSize:', props.cellSize)
  console.log('rows:', props.rows)
  console.log('columns:', props.columns)
  console.log('table:', props.table.join(''))
  console.log('palette:', props.palette.join(','))
}

const updateFormFromAutomatonProps = (props) => {
  document.querySelector('#colors').value = props.colors
  document.querySelector('#cell-size').value = props.cellSize
  document.querySelector('#rows').value = props.rows
  document.querySelector('#columns').value = props.columns
  document.querySelector('#table').value = props.table.join('')
}

window.addEventListener('DOMContentLoaded', () => {
  const automatonProps = generateAutomatonFromUrlParams()
  logAutomatonProps(automatonProps)
  updateFormFromAutomatonProps(automatonProps)

  const sidebar = document.querySelector('.sidebar')
  const toggleButton = document.querySelector('.sidebar__toggle-button')
  toggleButton.onclick = function () {
    sidebar.classList.toggle('sidebar--large')
    toggleButton.classList.toggle('sidebar__toggle-button--close')
  }

  const generateButton = document.querySelector('#generate-automaton')
  generateButton.addEventListener('click', () => {
    const automatonProps = generateAutomatonFromForm()
    logAutomatonProps(automatonProps)
    updateFormFromAutomatonProps(automatonProps)
  })
})
