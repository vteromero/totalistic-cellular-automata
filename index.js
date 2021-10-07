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

const parseIntParam = (value, min, max, deflt) => {
  const n = parseInt(value)

  if (Number.isNaN(n)) return deflt
  if (n < min) return min
  if (n > max) return max

  return n
}

const parseColorsParam = (colors) => (
  parseIntParam(colors, COLORS_MIN, COLORS_MAX, COLORS_DEFAULT)
)

const parseCellSizeParam = (cellSize) => (
  parseIntParam(cellSize, CELL_SIZE_MIN, CELL_SIZE_MAX, CELL_SIZE_DEFAULT)
)

const parseRowsParam = (rows) => (
  parseIntParam(rows, ROWS_MIN, ROWS_MAX, ROWS_DEFAULT)
)

const parseColumnsParam = (columns) => (
  parseIntParam(columns, COLUMNS_MIN, COLUMNS_MAX, COLUMNS_DEFAULT)
)

const parseTableParam = (table, automatonFuncs) => {
  const tableArray = automatonFuncs.tableStrToArray(table)

  if (tableArray) {
    return [tableArray, false]
  } else {
    return [automatonFuncs.randomBalancedTable(), true]
  }
}

const parsePaletteParam = (palette, automatonFuncs) => {
  const paletteArray = automatonFuncs.paletteStrToArray(palette)

  if (paletteArray) {
    return [paletteArray, false]
  } else {
    return [automatonFuncs.randomPalette(), true]
  }
}

const parseFirstRowParam = (firstRow, columns, automatonFuncs) => {
  const firstRowArray = automatonFuncs.rowStrToArray(firstRow)

  if (firstRowArray && firstRowArray.length === columns) {
    return firstRowArray
  } else {
    return automatonFuncs.randomRow(columns)
  }
}

const addPaletteColorInputs = (palette) => {
  const colorsInputs = palette.map(paletteColor => {
    const input = document.createElement('input')
    input.setAttribute('type', 'color')
    input.setAttribute('class', 'sidebar__color-input')
    input.setAttribute('value', paletteColor)

    return input
  })

  document.querySelector('#palette-container').replaceChildren(...colorsInputs)
}

const disablePaletteColorInputs = (disabled) => {
  document.querySelectorAll('.sidebar__color-input').forEach(input => (
    input.disabled = disabled
  ))
}

const getPaletteStrFromColorInputs = () => {
  const colorInputs = document.querySelectorAll('.sidebar__color-input')
  const palette = [ ...colorInputs ].map(input => (input.value))

  return palette.map(colorHex => (colorHex.substring(1))).join(',')
}

const automatonPropsFromUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const colors = parseColorsParam(urlParams.get('colors'))
  const automatonFuncs = totatlisticCellularAutomatonFunctions(colors)
  const cellSize = parseCellSizeParam(urlParams.get('cellSize'))
  const rows = parseRowsParam(urlParams.get('rows'))
  const columns = parseColumnsParam(urlParams.get('columns'))
  const [table, isRandomTable] = parseTableParam(urlParams.get('table'), automatonFuncs)
  const [palette, isRandomPalette] = parsePaletteParam(urlParams.get('palette'), automatonFuncs)
  const firstRow = parseFirstRowParam(urlParams.get('firstRow'), columns, automatonFuncs)

  return { colors, cellSize, rows, columns, table, isRandomTable, palette, isRandomPalette, firstRow, funcs: automatonFuncs }
}

const automatonPropsFromForm = () => {
  const colors = parseColorsParam(document.querySelector('#colors').value)
  const automatonFuncs = totatlisticCellularAutomatonFunctions(colors)
  const cellSize = parseCellSizeParam(document.querySelector('#cell-size').value)
  const rows = parseRowsParam(document.querySelector('#rows').value)
  const columns = parseColumnsParam(document.querySelector('#columns').value)
  const randomTableChecked = document.querySelector('#random-table').checked
  const tableStr = randomTableChecked ? '' : document.querySelector('#table').value
  const [table, isRandomTable] = parseTableParam(tableStr, automatonFuncs)
  const randomPaletteChecked = document.querySelector('#random-palette').checked
  const paletteStr = randomPaletteChecked ? '' : getPaletteStrFromColorInputs()
  const [palette, isRandomPalette] = parsePaletteParam(paletteStr, automatonFuncs)
  const firstRow = automatonFuncs.randomRow(columns)

  return { colors, cellSize, rows, columns, table, isRandomTable, palette, isRandomPalette, firstRow, funcs: automatonFuncs }
}

const generateAutomaton = (props) => {
  const { cellSize, rows, columns, table, palette, firstRow, funcs } = props
  const grid = funcs.createGrid(rows, table, firstRow)

  const canvas = document.getElementById('canvas')
  const width = columns * cellSize
  const height = rows * cellSize

  resizeCanvas(canvas, width, height)

  funcs.drawGrid(canvas, grid, cellSize, palette)
}

const generateAutomatonFromUrlParams = () => {
  const props = automatonPropsFromUrlParams()

  generateAutomaton(props)

  return props
}

const generateAutomatonFromForm = () => {
  const props = automatonPropsFromForm()

  generateAutomaton(props)

  return props
}

const logAutomatonProps = (props) => {
  console.log('colors:', props.colors)
  console.log('cellSize:', props.cellSize)
  console.log('rows:', props.rows)
  console.log('columns:', props.columns)
  console.log('table:', props.table.join(''))
  console.log('palette:', props.palette.join(','))
  console.log('firstRow:', props.firstRow.join(''))
}

const updateFormFromAutomatonProps = (props) => {
  document.querySelector('#colors').value = props.colors
  document.querySelector('#cell-size').value = props.cellSize
  document.querySelector('#rows').value = props.rows
  document.querySelector('#columns').value = props.columns
  document.querySelector('#table').value = props.table.join('')
  document.querySelector('#table').disabled = props.isRandomTable
  document.querySelector('#random-table').checked = props.isRandomTable
  document.querySelector('#random-palette').checked = props.isRandomPalette
  addPaletteColorInputs(props.palette)
  disablePaletteColorInputs(props.isRandomPalette)
  document.querySelector('#first-row').value = props.firstRow.join('')
}

const addSidebarToggleButtonClickHandler = () => {
  const sidebar = document.querySelector('.sidebar')
  const toggleButton = document.querySelector('.sidebar__toggle-button')

  toggleButton.onclick = function () {
    sidebar.classList.toggle('sidebar--large')
    toggleButton.classList.toggle('sidebar__toggle-button--close')
  }
}

const addRandomTableCheckboxChangeHandler = () => {
  document.querySelector('#random-table').addEventListener('change', event => {
    document.querySelector('#table').disabled = event.target.checked
  })
}

const addRandomPaletteCheckboxChangeHandler = () => {
  document.querySelector('#random-palette').addEventListener('change', event => {
    disablePaletteColorInputs(event.target.checked)
  })
}

const addGenerateAutomatonButtonClickHandler = () => {
  document.querySelector('#generate-automaton').addEventListener('click', () => {
    const automatonProps = generateAutomatonFromForm()

    logAutomatonProps(automatonProps)
    updateFormFromAutomatonProps(automatonProps)
  })
}

window.addEventListener('DOMContentLoaded', () => {
  const automatonProps = generateAutomatonFromUrlParams()
  logAutomatonProps(automatonProps)
  updateFormFromAutomatonProps(automatonProps)

  addSidebarToggleButtonClickHandler()
  addRandomTableCheckboxChangeHandler()
  addRandomPaletteCheckboxChangeHandler()
  addGenerateAutomatonButtonClickHandler()
})
