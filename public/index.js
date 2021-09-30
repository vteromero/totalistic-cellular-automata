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

const generateAutomatonFromUrlParams = () => {
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
}

const generateAutomatonFromForm = () => {
  const colors = parseColorsParam(document.querySelector('#colors').value)
  const automaton = createTotatlisticCellularAutomaton(colors)

  const cellSize = parseCellSizeParam(document.querySelector('#cell-size').value)
  const rows = parseRowsParam(document.querySelector('#rows').value)
  const columns = parseColumnsParam(document.querySelector('#columns').value)
  const table = automaton.randomBalancedTable()
  const palette = automaton.randomPalette()

  const firstRow = automaton.randomRow(columns)
  const grid = automaton.createGrid(rows, table, firstRow)

  const canvas = document.getElementById('canvas')
  const width = columns * cellSize
  const height = rows * cellSize

  resizeCanvas(canvas, width, height)

  automaton.drawGrid(canvas, grid, cellSize, palette)
}

window.addEventListener('DOMContentLoaded', () => {
  generateAutomatonFromUrlParams()

  console.log('colors:', colors)
  console.log('rows:', rows)
  console.log('columns:', columns)
  console.log('cellSize:', cellSize)
  console.log('table:', table.join(''))
  console.log('palette:', palette.join(','))

  const sidebar = document.querySelector('.sidebar')
  const toggleButton = document.querySelector('.sidebar__toggle-button')
  toggleButton.onclick = function () {
    sidebar.classList.toggle('sidebar--large')
    toggleButton.classList.toggle('sidebar__toggle-button--close')
  }

  document.querySelector('#colors').value = colors
  document.querySelector('#cell-size').value = cellSize
  document.querySelector('#rows').value = rows
  document.querySelector('#columns').value = columns

  const generateButton = document.querySelector('#generate-automaton')
  generateButton.addEventListener('click', () => {
    generateAutomatonFromForm()
  })
})
