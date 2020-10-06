// https://docs.google.com/spreadsheets/d/12TBoX2UI_Yu2MA2ZN3p9f-cZsySE4et1slwpgjZbSzw/edit#gid=0
// https://stackoverflow.com/questions/24954722/how-do-you-create-a-reverse-pivot-in-google-sheets

//
// https://leelkennedy.com/how-to-fill-an-import-range-function-with-dynamic-references/

/**
 * Unpivot a pivot table of any size.
 *
 * @param {A1:D30} data The pivot table.
 * @param {1} fixColumns Number of columns, after which pivoted values begin. Default 1.
 * @param {1} fixRows Number of rows (1 or 2), after which pivoted values begin. Default 1.
 * @param {""city""} titlePivot The title of horizontal pivot values. Default ""column"".
 * @param {""distance""[,...]} titleValue The title of pivot table values. Default ""value"".
 * @return The unpivoted table
 * @customfunction
 */


function unpivot(sheetName, fixColumns, fixRows, titlePivot, titleValue) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let fromSheet = ss.getSheetByName(sheetName);
  let data = fromSheet.getDataRange().getValues();
  
  var fixColumns = fixColumns || 1; // how many columns are fixed
  var fixRows = fixRows || 1; // how many rows are fixed
  var titlePivot = titlePivot || 'column';
  var titleValue = titleValue || 'value';
  var ret=[], i, j, row, uniqueCols = 1;
  
  // we handle only 2 dimension arrays
  if (!Array.isArray(data) || data.length < fixRows || !Array.isArray(data[0]) || data[0].length < fixColumns)
    throw new Error('no data');
  // we handle max 2 fixed rows
  if (fixRows > 2)
    throw new Error('max 2 fixed rows are allowed');
  
  // fill empty cells in the first row with value set last in previous columns (for 2 fixed rows)
  var tmp = '';
  for (j=0;j<data[0].length;j++)
    if (data[0][j] != '') 
      tmp = data[0][j];
    else
      data[0][j] = tmp;
  
  // for 2 fixed rows calculate unique column number
  if (fixRows == 2)
  {
    uniqueCols = 0;
    tmp = {};
    for (j=fixColumns;j<data[1].length;j++)
      if (typeof tmp[ data[1][j] ] == 'undefined')
      {
        tmp[ data[1][j] ] = 1;
        uniqueCols++;
      }
  }
  
  // return first row: fix column titles + pivoted values column title + values column title(s)
  row = [];
    for (j=0;j<fixColumns;j++) row.push(fixRows == 2 ? data[0][j]||data[1][j] : data[0][j]); // for 2 fixed rows we try to find the title in row 1 and row 2
    for (j=3;j<arguments.length;j++) row.push(arguments[j]);
  ret.push(row);
    
  // processing rows (skipping the fixed columns, then dedicating a new row for each pivoted value)
  for (i=fixRows;i<data.length && data[i].length > 0;i++)
  {
    // skip totally empty or only whitespace containing rows
    if (data[i].join('').replace(/\s+/g,'').length == 0 ) continue;
    
    // unpivot the row
    row = [];
    for (j=0;j<fixColumns && j<data[i].length;j++)
      row.push(data[i][j]);
    for (j=fixColumns;j<data[i].length;j+=uniqueCols)
      ret.push( 
        row.concat([data[0][j]]) // the first row title value
        .concat(data[i].slice(j,j+uniqueCols)) // pivoted values
      );
  }

  return ret;
}					
						
						
						
						
						