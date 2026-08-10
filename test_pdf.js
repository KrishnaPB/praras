const fs = require('fs');
const pdfParse = require('pdf-parse');
let dataBuffer = fs.readFileSync('food_Products/PS Biscamaze  CW  V 2.0.pdf');
pdfParse(dataBuffer).then(function(data) {
    console.log(data.text.substring(0, 500));
}).catch(err => console.error(err));
