const PI=3.14159;
const N=10;
const getValue=(x)=>{
    return Math.exp(x);
}
const getChebishovZeroes=(n)=>{
    const zeroes=[];
    for(let i=1;i<=n;++i){
        const x=Math.cos(((2*i-1)/(2*n))*PI);
        zeroes.push(x);
    }
    return zeroes;
}
const getF=(lastIndex,x,y)=>{
    let sum=0;
    for(let i=0;i<lastIndex;++i){
        const up=y[i];
        let down=1;
        for(let j=0;j<lastIndex;++j){
            if(i===j) continue;
            down*=x[i]-x[j];
        }
        sum+=up/down;
    }
    return sum;
}
const getNewtonByChebishov=(value)=>{
    const x=getChebishovZeroes(N);
    const y=x.map(elem=>getValue(elem));
    let sum=0;
    for(let i=0;i<N;++i){
        let product=1;
        for(let j=0;j<i;++j){
            product*=(value-x[j]);
        }
        sum+=getF(i+1,x,y)*product;
    }
    return sum;
}
const getDeltaF=(n,k,y)=>{
    if(n===1) return y[k+1]-y[k];
    return getDeltaF(n-1,k+1,y)-getDeltaF(n-1,k,y);
}
const getNewton=(value)=>{
    const h=0.1;
    const x0=0.2;
    const x=[];
    for (let i=0;i<N;++i){
        x.push(x0+h*i);
    }
    const y=x.map(elem=>getValue(elem));
    const t=(value-x0)/h;
    let sum=y[0];
    for(let i=0;i<N-1;++i){
        let productT=t;
        for(let j=1;j<=i;++j){
            productT*=t-j;
        }
        sum+=getDeltaF(i+1,0,y);
    }
    return sum;
}
console.log(getNewtonByChebishov(0.3));
console.log(getNewton(0.3));
