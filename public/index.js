import {
  resizeCanvas,
  totatlisticCellularAutomatonFunctions
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

const generateAutomatonFromUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)

  const colors = parseColorsParam(urlParams.get('colors'))
  const automatonFuncs = totatlisticCellularAutomatonFunctions(colors)

  const cellSize = parseCellSizeParam(urlParams.get('cellSize'))
  const rows = parseRowsParam(urlParams.get('rows'))
  const columns = parseColumnsParam(urlParams.get('columns'))
  const table = automatonFuncs.tableStrToArray(urlParams.get('table')) || automatonFuncs.randomBalancedTable()
  const palette = automatonFuncs.paletteStrToArray(urlParams.get('palette')) || automatonFuncs.randomPalette()

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
  const table = automatonFuncs.randomBalancedTable()
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
