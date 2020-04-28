// f=x^4+3x^3-20x^2-44x-54
const getValue=(x)=>{
    return Math.pow(x,4)+3*Math.pow(x,3)-20*Math.pow(x,2)-44*x-54;
}

const getValuePhi = (x) => {
    return -3 + 20 / x + 44 / Math.pow(x, 2) + 54 / Math.pow(x, 3);
}
const isFinished = (x2, x1) => {
    return Math.abs(x2 - x1) <= ((1 - q) / q) * E;
}
const getAprior = () => {
    const up = Math.log((b - a) / (E * (1 - q)));
    const down = Math.log(1 / q);

    return Math.floor(up / down) + 1;
}

const E = 1e-7;
const a = -6;
const b = -5;
const q = 222 / 625;

let x0 = -5.5;
let x1 = getValuePhi(x0);
let i = 1;
console.log(`iteration ${i}, x=${x1}`);
while (!isFinished(x1, x0)) {
    i++;
    x0 = x1;
    x1 = getValuePhi(x1);
    console.log(`iteration ${i}, x=${x1}`);
}
console.log(`f=${getValue(x1)}`);
console.log(`апріорна оцінка:n >= ${getAprior()}`);
console.log(`апостеріорна оцінка:n >= ${i}`);