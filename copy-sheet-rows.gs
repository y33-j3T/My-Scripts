//  var targetSpreadsheet = SpreadsheetApp.openById('8AjN7u....'); 
//  var targetSheet = targetSpreadsheet.getSheetByName('RAWData'); 

const WHITE = "#ffffff";


// current spreadsheet
let ss = SpreadsheetApp.getActiveSpreadsheet();

// individual sheets
let senaiSheet = ss.getSheetByName("Senai");
let testSheet = ss.getSheetByName("test");

//******************//
// helper functions //
//******************//
// true if all cells have any color other than white
function hasColor(range) {
  return range.getBackground() != WHITE;
}

// true if all cells have strikethrough format
function hasStrikethrough(range) {
  return range.getFontLines() == "line-through";
}


// copy row if it's valid
function isValidRow(range) {
  return (!hasColor(range) && !hasStrikethrough(range));
}

// copy over rows
function copyRow(fromRange, toRange) {
  toRange.setValues(fromRange.getValues());
}

// get row to copy over
function getRow(fromRange) {
  return fromRange.getValues();
}

function updatePbiSheet(fromSheet, toSheet) {
  
  let res = []
  
  // data
  let dataRange = fromSheet.getDataRange();
  
  // cell boundary for data
  let rowStart = dataRange.getRow();
  let rowEnd = dataRange.getLastRow();
  let colStart = dataRange.getColumn();
  let colEnd = dataRange.getLastColumn();
  
  // loop through each row
  for (i = rowStart; i < rowEnd; i++){
  
    // source row
    let fromRange = fromSheet.getRange(i, colStart, 1, colEnd);

    // pass if source row is not what we want
    if (!isValidRow(fromRange)) continue;
  
    // target row
    let lastRow = toSheet.getLastRow() + 1;
    let toRange = toSheet.getRange(lastRow, colStart , 1, colEnd);
    
    let tmp = getRow(fromRange)[0]; // idx 0 to get first & only row
    res.push(tmp);
  }

  return res;
}


// MAIN: run this function to update sheets
// @customfunction
function update() {
  return updatePbiSheet(senaiSheet, testSheet);
}

// experiment: use this function to update things upon edit
function onEdit(e) {
  var range = e.range;
  update()
}