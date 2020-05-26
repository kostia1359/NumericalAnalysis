const {Matrix} = require('ml-matrix');
const e = 1e-4;

const maxLambda = (A, x0) => {
    let prev = 0;
    let cur = 0;
    do {
        prev = cur;
        let x1 = x0.mmul(A);
        cur = x1.get(0, 0) / x0.get(0, 0);
        x0 = x1;
    } while (Math.abs(cur - prev) > e);
    return cur;
}
const getB = (A, maxLambda) => {
    return Matrix.eye(3, 3).mul(maxLambda).sub(A);
}
const minLambda = (A, x0, maxLambdaForA) => {
    let b = getB(A, maxLambdaForA);
    let maxLambdaForB = maxLambda(b, x0.mul(-1));
    return maxLambdaForA - maxLambdaForB;
}


let x0 = new Matrix([[1, 1, 1]]);
let matrix = new Matrix([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])
let maxLambdaForMatrix = maxLambda(matrix, x0);
console.log(maxLambdaForMatrix);
console.log(minLambda(matrix, x0, maxLambdaForMatrix))
