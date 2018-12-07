class Vector {
  constructor(dimensions) {

    if(!Array.isArray(dimensions) && typeof dimensions === 'number' ) {
      this._vector = [];
      for(let i = 0; i < dimensions; i++) {
        this._vector.push(0);
      }
      this._dimensions = dimensions;
    }

    else if(Array.isArray(dimensions)) {
      for(let i = 0; i < dimensions.length; i++) {
        if(typeof dimensions[i] !== 'number') {
          return false;
        }
      }
      this._vector = [];
      for(let i = 0; i < dimensions.length; i++) {
        this._vector.push(dimensions[i]);
      }

      this._dimensions = dimensions.length;
    }


  }

  get vector() {
    return this._vector
  }

  get dimensions() {
    return this._dimensions;
  }

  
  magnitude(decimalPlaces = 3) {
    if(decimalPlaces < 1 || decimalPlaces > 21) {
      return false;
    }
    else if(decimalPlaces > 1 && decimalPlaces <= 21) {
      let result = 0;
      for(let i = 0; i < this.dimensions; i++) {
        result = result + Math.pow(this.vector[i], 2);
      }
      // result = Math.pow(result, 1/this.dimensions);
      result = Math.sqrt(result).toPrecision(decimalPlaces);
  
      return result;
    }

  }


  get stringVersion() {
    let str = "";

    for(let i = 0; i < this.vector.length; i++) {
      // figure out the greatest number in the column so as to ensure that proper padding can make decimal places align.
      let greatestInColumn = this._getGreatestInVector;
      // apply padding (if any)
      let paddingSpace = this._getPaddingSpace(greatestInColumn.value, this.vector[i]);
          

      str = str + "|" + paddingSpace + this.vector[i] + "|\n";
    }

    // console.log(this._getGreatestInVector);
    return str;
  }

    // private method for finding the greatest element in a column. Used for figuring out how much space should be placed before each element in the vector.
    get _getGreatestInVector() {
      let greatestYet = {
        identity: this.vector[0],
        value: this.vector[0].toString().length,
        index: 0
      }
  
      for(let j = 0; j<this.vector.length; j++) {
        if(this.vector[j].toString().length > greatestYet.value) {
          greatestYet.identity = this.vector[j];
          greatestYet.value = this.vector[j].toString().length;
          greatestYet.index = j;
        }
      }
  
      return greatestYet;
    }

  // a private method for finding out how much space should be placed before a number to ensure the uniform size of each matrix element for display purposes
  _getPaddingSpace(greatestNum, thisNum) {
    let neededSpaces = greatestNum - thisNum.toString().length;
    let spaces= "";

    for(let i = 0; i<neededSpaces; i++) {
      spaces = spaces + " ";
    }

    return spaces;
  }

  static _toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  static angleBetween(vector1, vector2, decimalPlaces = 3) {
    let result = 0;
    result = this._toDegrees(Math.acos((this.dotProduct(vector1, vector2))/(vector1.magnitude(21)*vector2.magnitude(21)))).toPrecision(decimalPlaces);

    return result;
  }

  static dotProduct(vector1, vector2) {
    if(vector1.dimensions !== vector2.dimensions || typeof vector1 === 'undefined' || typeof vector2 === 'undefined') {
      return false;
    }
    else if(vector1.dimensions === vector2.dimensions && typeof vector1 !== 'undefined' && typeof vector2 !== 'undefined') {
      let result = 0;
      for(let i = 0; i < vector1.dimensions; i++) {
        result = result + vector1.vector[i] * vector2.vector[i];
      }
      return result;
    }
  }

  static crossProduct(vector1, vector2) {
    let result = new Vector(3);

    if(vector1.dimensions !== vector2.dimensions || typeof vector1 === 'undefined' || typeof vector2 === 'undefined' || vector1.dimensions !== 3 || vector2.dimensions !== 3) {
      return false;
    }
    else  {
      result.vector[0] = (vector1.vector[1]*vector2.vector[2] - vector1.vector[2]*vector2.vector[1]);
      result.vector[1] = (vector1.vector[2]*vector2.vector[0] - vector1.vector[0]*vector2.vector[2]);
      result.vector[2] = (vector1.vector[0]*vector2.vector[1] - vector1.vector[1]*vector2.vector[0]);
    }

    return result;
  }

  static constantMultiplication(vector, C) {
    let newVector = new Vector(vector.vector.length);

    for(let i = 0; i < vector.vector.length; i++) {
      newVector.vector[i] = vector.vector[i] * C;
    }
    console.log(newVector);
    return newVector;
  }

}


let vector1 = new Vector([-1,7,4]);
let vector2 = new Vector([-5,8,4]);
console.log(Vector.crossProduct(vector1, vector2).stringVersion);





















class Matrix {
  constructor(width, height) {
    this._matrix = [];
    // checks if the matrix is being initalized using arrays of columns or if from width/height dimernsions.
    let arrayInit = true;
    for(let i = 0; i < arguments[0].length; i++) {
      if(!Array.isArray(arguments[0][i])) {
        arrayInit = false;
      }
    }

    // if the array is being intialized from an array it simply loads the values into the matrix. Otherwise it creates a width by height matrix with values initialzed to zero.
    if(arrayInit) {
      for(let i = 0; i<arguments[0].length; i++) {
          this._matrix.push(arguments[0][i]);
      }
      this._width = this._matrix.length;
      this._height = this._matrix[0].length;
    }
    else if(!arrayInit) {
      for(let i = 0; i<width; i++) {
        let matrixLine = [];
        for(let j = 0; j<height; j++) {
          matrixLine.push(0);
        }
        this._matrix.push(matrixLine);
      }
        this._width = width;
        this._height = height;
    }
  }

  get matrix() {
    return this._matrix;
  }

  getValueAt(i, j) {
    return this._matrix[i][j];
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  setValueAt(i, j, newValue) {
    this._matrix[i][j] = newValue
  }

  // class method for adding matrices element wise
  static addMatrices(matrix1, matrix2)  {
    let matrixWidth = matrix1.width;
    let matrixHeight = matrix1.height;
    var newMatrix = new Matrix(matrixWidth, matrixHeight);  

    if(matrix1.height !== matrix2.height || matrix1.width !== matrix2.width) {
      return false;
    }
    else {
      for(let j = 0; j < matrixHeight; j++) {
        for(let i = 0; i < matrixWidth; i++) {    
          newMatrix._matrix[i][j] = matrix1._matrix[i][j] + matrix2._matrix[i][j];
        }
      }

      return newMatrix
    }    
  }

  static multiplyMatrices(matrix1, matrix2) {
    let newMatrix = new Matrix(matrix2.width, matrix1.height);

    if(matrix1.width !== matrix2.height) {
      return false;
    }
    else {
      for(let j = 0; j < newMatrix.height; j++) {
        for(let i = 0; i < newMatrix.width; i++) {
          let rowResult = 0;
          for(let x = 0; x < matrix1.width; x++) {
            rowResult = rowResult + (matrix1.matrix[x][j]*matrix2.matrix[i][x]);
          }
          newMatrix.matrix[i][j] = rowResult;
        }
      } 
      return newMatrix;
    }
  }

  // class method for find the matrix product element wise
  static hadamardProduct(matrix1, matrix2) {
    let matrixWidth = matrix1.width;
    let matrixHeight = matrix1.height;
    var newMatrix = new Matrix(matrixWidth, matrixHeight);  

    if(matrix1.height !== matrix2.height || matrix1.width !== matrix2.width) {
      return false;
    }
    else {
      for(let j = 0; j < matrixHeight; j++) {
        for(let i = 0; i < matrixWidth; i++) {    
          newMatrix._matrix[i][j] = matrix1._matrix[i][j] * matrix2._matrix[i][j];
        }
      }

      return newMatrix
    }    
  }

  // class method for multiplying a matrix by a constant
  static constantMultiplication(matrix, C) {
    let matrixWidth = matrix1.width;
    let matrixHeight = matrix1.height;
    let newMatrix = new Matrix(matrixWidth, matrixHeight);

    for(let j = 0; j < matrixHeight; j++) {
      for(let i = 0; i < matrixWidth; i++) {
        newMatrix._matrix[i][j] = matrix1._matrix[i][j] * C;
      }
    }

    return newMatrix
  }

  // class method returns new matrix which is the transpose of the input matrix.
  static transpose(matrix) {
    let matrixWidth = matrix.height;
    let matrixHeight = matrix.width;
    let newMatrix = new Matrix(matrixWidth, matrixHeight);

    for(let j = 0; j < matrixHeight; j++) {
      for(let i = 0; i < matrixWidth; i++) {
        newMatrix.matrix[i][j] = matrix._matrix[j][i];
      }
    }

    return newMatrix
  }

  static determinant(matrix) {
    // check if matrix is square. If not return false.
    if(matrix.width !== matrix.height) {
      return false
    }

    //if matrix is square proceed with computation.
    else {
      if(matrix.width === 2) {
        return matrix.matrix[0][0]*matrix.matrix[1][1] - matrix.matrix[1][0]*matrix.matrix[0][1];
      }
      else {
        let determinant = 0;
        let sign = 1;
        let mask = {
          columnToOmit: 0,
          rowToOmit: 0
        }
        for(let i = 0; i < matrix.width; i++) {
          if(sign % 2 === 1) {
            determinant = determinant + matrix.matrix[i][0]*Matrix.determinant(this.getSubmatrixFromMask(matrix, mask));
          }
          else if(sign % 2 === 0) {
            determinant = determinant - matrix.matrix[i][0]*Matrix.determinant(this.getSubmatrixFromMask(matrix, mask));
          }
          mask.columnToOmit = mask.columnToOmit + 1;
          sign++;
        }
        
        return determinant;
      }
    }

  }

  // swaps the columns in the matrix
  swapColumns(columnA, columnB) {
    // checks to make sure that the columns specified in the argument actually exist. If NOT then returns false. Else if continues with the swap operation.
    if(columnA < 0 || columnB < 0 || columnA > this.width || columnB > this.width) {
      return false;
    }
    else {
      // creates a copy of the columnA so that it is not overwritten during the swap.
      let columnABuffer = []
      for(let j = 0; j < this.height; j++) {
        columnABuffer.push(this.matrix[columnA][j]);
      }

      // overwrites the values columnA with the values from columnB
      for(let j = 0; j < this.height; j++) {
        this.matrix[columnA][j] = this.matrix[columnB][j];
      }
      // overwrite the values from columnB with columnA
      for(let j = 0; j < this.height; j++) {
        this.matrix[columnB][j] = columnABuffer[j];
      }

      return true;
    }
  }

  // swaps the rows in the matrix
  swapRows(rowA, rowB) {
    // checks to make sure that the rows specified in the argument actually exist. If NOT then returns false. Else if continues with the swap operation.
    if(rowA < 0 || rowB < 0 || rowA > this.height || rowB > this.height) {
      return false;
    }
    else {
      // creates a copy of the rowA so that it is not overwritten during the swap.
      let rowABuffer = []
      for(let i = 0; i < this.width; i++) {
        rowABuffer.push(this.matrix[i][rowA])
      }

      // overwrites the values rowA with the values from columnB
      for(let i = 0; i < this.width; i++) {
        this.matrix[i][rowA] = this.matrix[i][rowB];
      }
     // overwrite the values from columnA with columnB
      for(let i = 0; i < this.width; i++) {
        this.matrix[i][rowB] = rowABuffer[i];
      }

      return true;
    }
  }


  static getSubmatrixFromMask(matrix, mask) {
    let columnToOmit = mask.columnToOmit;
    let rowToOmit = mask.rowToOmit;

    // if(columnToOmit > matrix.width || rowToOmit > matrix.height || columnToOmit < 0 || rowToOmit < 0) {
    //   return false
    // }

    if(typeof columnToOmit === 'undefined' && typeof rowToOmit === 'undefined') {
      let newMatrix = new Matrix(matrix.width, matrix.height);
      for(let j = 0; j < matrix.height; j++) {
        for(let i = 0; i < matrix.width; i++) {
          newMatrix.matrix[i][j] = matrix.matrix[i][j];
        }
      }
      return newMatrix;     
    }

    else {
      // console.log("columnToOmit = " + columnToOmit);
      // console.log("rowToOmit = " + rowToOmit);
      let newMatrix = [];
      let newMatrixColumns = [];
      for(let i = 0; i < matrix.width; i++) {
        for(let j = 0; j < matrix.height; j++) {
          if(j !== rowToOmit && i !== columnToOmit) {
            newMatrixColumns.push(matrix.matrix[i][j]);
          }
        }
        if(typeof newMatrixColumns[0] !== 'undefined') {
          newMatrix.push(newMatrixColumns);
        }
        newMatrixColumns = [];
      }

      newMatrix = new Matrix(newMatrix);
      return newMatrix;
    }
  }


  // a public method for displaying the matrix as an easy to read matrix string. 
  stringVersion(startPoint = [0, 0], endPoint=[this.width - 1, this.height - 1]) {


    // return false if the cordinates are not arrays or if they are not the proper dimensions OR if the first vector is not to the left/up of the second.
    if(!Array.isArray(startPoint) || !Array.isArray(endPoint) || startPoint.length !== 2 || endPoint.length !== 2 || startPoint[0] < 0 || startPoint[0] > this.width || startPoint[1] < 0 || startPoint[1] > this.height || endPoint[0] < 0 || endPoint[0] > this.width || endPoint[1] < 0 || endPoint[1] > this.height || startPoint[0] > endPoint[0] || startPoint[1] > endPoint[1]) {
      return false
    }
    // proceed with the method if the above safety check is passed
    else {
      // initialize strMatrix variable which will store the string version of the matrix.
      let strMatrix = ""
      //increment the end points by one to ensure that they function like .length for an array while allowing the user to use conventional 0 starting cordinates.
      endPoint[0]++;
      endPoint[1]++;

      // convert each element of the matrix into a string and fit into text with proper padding, parsing, and notation.
      for(let j = startPoint[1]; j<endPoint[1]; j++) {
        for(let i = startPoint[0]; i<endPoint[0]; i++) {
          // figure out the greatest number in the column so as to ensure that proper padding can make decimal places align.
          let greatestInColumn = this._getGreatestInColumn(this._matrix[i])
          // apply padding (if any)
          let paddingSpace = this._getPaddingSpace(greatestInColumn.value, this._matrix[i][j]);
          
          // special condition for if sub matrix is a column but not at end of matrix.
          if(startPoint[0] === (endPoint[0]-1) && j !== endPoint[1] - 1) {
            strMatrix = strMatrix + "|" + this._matrix[i][j].toString() + "|\n"
          }
          // special condition for if sub matrix is a column and END of matrix.
          else if(startPoint[0] === (endPoint[0]-1) && j === endPoint[1] - 1) {
            strMatrix = strMatrix + "|" + this._matrix[i][j].toString() + "|"
          }

          // start of new matrix
          else if(i === startPoint[0] && j === startPoint[1]) {
            strMatrix = "|" + paddingSpace + strMatrix + this._matrix[i][j].toString();
          }
          // elements in middle of matrix
          else if(i !== startPoint[0] && i !== endPoint[0] - 1) {
            strMatrix = strMatrix + ", " + paddingSpace + this._matrix[i][j].toString();
          }
          // elements at the start of a new line in the matrix
          else if(i === startPoint[0] && j !== startPoint[1]) {
            strMatrix = strMatrix + "|" + paddingSpace +  + this._matrix[i][j].toString();
          }
          // the end of a line
          else if(i === endPoint[0]  - 1 && j !== endPoint[1] - 1) {
            strMatrix = strMatrix + ", " + paddingSpace + this._matrix[i][j].toString() + "|\n";
          }
          else if(i === endPoint[0]  - 1 && j === endPoint[1] - 1) {
            strMatrix = strMatrix + ", " + paddingSpace + this._matrix[i][j].toString() + "|";
          }
        }
      }
      
      return strMatrix;
    }
  }

  // private method for finding the greatest element in a column. Used for figuring out how much space should be placed before each element in the matrix.
  _getGreatestInColumn(column) {
    let greatestYet = {
      identity: column[0],
      value: column[0].toString().length,
      index: 0
    }

    for(let j = 0; j<column.length; j++) {
      if(column[j].toString().length > greatestYet.value) {
        greatestYet.identity = column[j];
        greatestYet.value = column[j].toString().length;
        greatestYet.index = j;
      }
    }

    return greatestYet;
  }


  // a private method for finding out how much space should be placed before a number to ensure the uniform size of each matrix element for display purposes
  _getPaddingSpace(greatestNum, thisNum) {
    let neededSpaces = greatestNum - thisNum.toString().length;
    let spaces= "";

    for(let i = 0; i<neededSpaces; i++) {
      spaces = spaces + " ";
    }

    return spaces;
  }

}

// add matrix operators: matrix addition, matrix multiplication, hadamard multiplication, etc...