function *numGen() {
    let current = 1;
    while(true) {
        yield current;
        current++;
    }
}

var y = numGen();
var till = 1000000;
for(let i = 0;i<till;i++){
	console.log(y.next().value);
}