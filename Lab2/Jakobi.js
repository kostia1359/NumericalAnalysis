const dimension = 3;
const e=1e-3;
let apostariar = 0;
const findQ = (matrix) => {
    let max = 0, sum = 0;
    for (let i = 1; i < dimension; ++i) {
        max += Math.abs(matrix[0][i]);
        max /= Math.abs(matrix[i][i]);
    }
    for (let j = 0; j < dimension; ++j) {
        for (let i = 1; i < dimension; ++i) {
            if (i === j) continue;
            sum += Math.abs(matrix[i][j])
        }
        sum /= Math.abs(matrix[j][j]);
        if (max < sum) {
            max = sum;
        }
        sum = 0;
    }
    return max;
}
const getNormaVector = (x1, x2) => {
    if (x1.length !== x2.length) return -1;
    let max = Math.abs(x1[0] - x2[0]);
    for (let i = 1; i < x1.length; ++i) {
        max = Math.max(Math.abs(x1[i] - x2[i]), max);
    }
    return max;
}
const getAprior = (matrix, vector, x0) => {
    let sum = 0, q = findQ(matrix);

    let x1 = [];
    for (let k = 0; k < dimension; ++k) {
        for (let i = 0; i < dimension; ++i) {
            if (i === k) continue;
            sum -= matrix[i][k] * x0[i];
        }
        sum = (sum + vector[k]) / matrix[k][k];
        x1.push(sum);
    }

    const ans = Math.log(getNormaVector(x0, x1) / ((1 - q) * e)) / Math.log(1 / q);
    return Math.trunc(ans) + 1;
}
const solve = (matrix, vector) => {
    let x = [];
    for (let i = 0; i < dimension; ++i) x.push(0);
    let xNew = [];
    let sum = 0;

    while (true) {
        for (let k = 0; k < dimension; ++k) {
            for(let i=0;i<dimension;++i){
                if(i===k) continue;
                sum-=matrix[i][k]*x[i];
            }
            sum=(sum+vector[k])/matrix[k][k];
            xNew.push(sum);
            sum=0;
        }
        ++apostariar;
        if (getNormaVector(x, xNew) < e)
            break;
        x=xNew;
        xNew=[];
    }

    return x;
}

const matrix=[
    [3,-1,1],
    [-1,2,0.5],
    [1,0.5,3]
];
const vector=[1,1.75,2.5];

let x=[];
let x0=[];
for (let i = 0; i < dimension; ++i) x0.push(0);
x=solve(matrix,vector,e);
for(let i=0;i<dimension;i++){
    console.log(`x${i}=${x[i]}`);
}
console.log(`апостеріорна оцінка:n >=${apostariar}`);
console.log(findQ(matrix));
console.log(`апріорна оцінка:n >= ${getAprior(matrix,vector,x0)}`)