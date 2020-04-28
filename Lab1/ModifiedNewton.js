let x0 = -5.4;
const getValue = (x) => {
    return Math.pow(x, 4) + 3 * Math.pow(x, 3) - 20 * Math.pow(x, 2) - 44 * x - 54;
}
const df = (function (x) {
    return 4 * Math.pow(x, 3) + 9 * Math.pow(x, 2) - 40 * x - 44;
})(x0);

const isFinished = (x1) => {
    return Math.abs(getValue(x1))<E;
}

const E = 1e-7;

let x1 = x0 - getValue(x0) / df;
let i = 1;
console.log(`iteration ${i}, x=${x1}`);
while (!isFinished(x1)) {
    i++;
    x1 = x1 - getValue(x1) / df;

    console.log(`iteration ${i}, x=${x1}`);
}

console.log(`f=${getValue(x1)}`);
console.log(`апостеріорна оцінка:n >= ${i}`);