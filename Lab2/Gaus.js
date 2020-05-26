const {Matrix, inverse} = require('ml-matrix');
const robustDeterminant = require("robust-determinant");
const E = 1e-5;
let leftPArr = [], rightPArr = [];
let replacementRows = 0;
const givenDimension = 3;
const getArr = (matrix) => {
    const arr = [];
    for (let i = 0; i < matrix.rows; ++i) {
        const temp = [];
        for (let j = 0; j < matrix.columns; ++j) {
            temp.push(matrix.get(i, j));
        }
        arr.push(temp);
    }
    return arr;
}
const getMax = (matrixArr, iteration, dimension = givenDimension) => {
    let max = [matrixArr[iteration][iteration], iteration, iteration];
    for (let row = iteration; row < dimension; ++row) {
        for (let column = iteration; column < dimension; ++column) {
            const elem = matrixArr[row][column]
            if (Math.abs(elem) > Math.abs(max[0])) max = [elem, row, column];
        }
    }
    return max;
}
const createDiagonalMatr = (dimension) => {
    const diagonal = [];
    const row = [1];
    for (let i = 1; i < dimension; ++i) {
        row.push(0);
    }
    for (let i = 0; i < dimension; ++i) {
        diagonal.push(row.slice());
        [row[i], row[i + 1]] = [row[i + 1], row[i]];
    }
    return diagonal;
}
const getP = (columnIndex, iteration, dimension = givenDimension) => {
    const n = columnIndex - iteration;
    replacementRows += ((n + 1) / 2) * n;

    const p = createDiagonalMatr(dimension);
    [p[iteration], p[columnIndex]] = [p[columnIndex], p[iteration]];
    return new Matrix(p);
}
const getM = (extendedMatrix, iteration) => {
    const dimension = extendedMatrix.rows;
    const diagonal = createDiagonalMatr(dimension);
    const [max, maxRow, maxColumn] = getMax(getArr(extendedMatrix), iteration);

    const rightP = getP(maxColumn, iteration);
    rightPArr.push(rightP);
    extendedMatrix = rightMMul(extendedMatrix, rightP);

    const leftP = getP(maxRow, iteration);

    leftPArr.push(leftP);
    extendedMatrix = leftP.mmul(extendedMatrix);

    const matrixArr = getArr(extendedMatrix);

    for (let i = iteration + 1; i < dimension; ++i) {
        diagonal[i][iteration] = -(matrixArr[i][iteration]) / max;
    }

    return [new Matrix(diagonal), extendedMatrix];
}
const rightMMul = (extendedMatrix, rightMatrix) => {
    const matrixArr = getArr(extendedMatrix);
    const vector = [];
    matrixArr.forEach(arr => vector.push(arr.pop()));
    const resArr = getArr((new Matrix(matrixArr)).mmul(rightMatrix));
    resArr.forEach(arr => arr.push(vector.shift()));

    return new Matrix(resArr);
}
const findSolutionVector = (upperTriangleMatrix) => {
    const dimension = upperTriangleMatrix.rows;
    const vector = [];
    for (let i = dimension - 1; i >= 0; --i) {
        let sum = upperTriangleMatrix.get(i, dimension);
        for (let j = dimension - 1; j > i; --j) {
            sum -= upperTriangleMatrix.get(i, j) * vector[dimension - j - 1];
        }
        vector.push(sum / upperTriangleMatrix.get(i, i));
    }
    return new Matrix([vector.reverse()]);
}
const getDeterminant = (upperTriangleMatrix, matrix) => {
    let determinant = 1;

    for (let i = 0; i < upperTriangleMatrix.rows; ++i) {
        determinant *= upperTriangleMatrix.get(i, i);
    }

    determinant *= Math.pow(-1, replacementRows);
    const robustDet = robustDeterminant(getArr(matrix));
    if (Math.abs(robustDet[0] - determinant) > E) return robustDet[0];

    return determinant;
}
const getNorm = (matrix) => {
    let max = 0;
    for (let column = 0; column < matrix.columns; ++column) {
        let sum = 0;
        for (let row = 0; row < matrix.rows; ++row) {
            sum += Math.abs(matrix.get(row, column))
        }
        max = Math.max(sum, max);
    }
    return max;
}
const removeLastVec = (extendedMatrix) => {
    const matrixArr = getArr(extendedMatrix);
    const vector = [];
    matrixArr.forEach(arr => vector.push(arr.pop()));

    return new Matrix(matrixArr);
}
const addLastVec = (matrix, vector) => {
    const matrixArr = getArr(matrix);

    matrixArr.forEach((arr, index) => {
        arr.push(vector[index]);
    });

    return new Matrix(matrixArr);
}
const getConditionNumber = (extendedMatrix, dimension = givenDimension) => {
    const inversed = [];
    const vectorE = [];
    const matrix = removeLastVec(extendedMatrix);
    for (let i = 0; i < dimension; ++i) vectorE.push(0);
    for (let i = 0; i < dimension; ++i) {
        vectorE[i] = 1;
        const solutionVector = solveGauss(addLastVec(matrix, vectorE))[0][0];
        inversed.push(solutionVector);
        vectorE[i] = 0;
    }
    const inversedMatrix = new Matrix(inversed).transpose();
    return getNorm(matrix) * getNorm(inversedMatrix)
}
const solveGauss = (extendedMatrix, dimension = givenDimension) => {
    leftPArr = [];
    rightPArr = [];
    replacementRows = 0;
    let Ai = extendedMatrix;
    for (let i = 0; i < dimension - 1; ++i) {
        const [Mi, PiA] = getM(Ai, i);
        Ai = Mi.mmul(PiA);
    }

    let solution = findSolutionVector(Ai);
    rightPArr.forEach(rightP => solution = solution.mmul(rightP));
    return [getArr(solution), getDeterminant(Ai, matrix)];
}
const showAnswer = ([solution, determinant], dimension = givenDimension) => {
    let answerStr = '';
    for (let i = 0; i < dimension; ++i) {
        answerStr += `x${i}=${solution[0][i]} `
    }
    console.log(answerStr);
    console.log(`determinant=${determinant}`);
}
const matrix = new Matrix([
    [2, -4, -1, 1],
    [-2, 3, -2, 1],
    [4, -11, -13, 10]
]);
showAnswer(solveGauss(matrix));
console.log(getConditionNumber(matrix));












