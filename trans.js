
const fs = require('fs');

const fileContent = fs.readFileSync('123.json', 'utf8');
const data = JSON.parse(fileContent);

// Extract the labels
const labels = data.slice(0, 6);
  
// Remove "Avg" and all labels from the data
const cleanedData = data.slice(6).filter(item => !labels.includes(item) && item !== "Avg");
  
// Pairing with labels
const result = [];
for (let i = 0; i < cleanedData.length; i += 6) {
    const entry = {};
    for (let j = 0; j < 6; j++) {
        entry[labels[j]] = cleanedData[i + j];
    }
    result.push(entry);
}
console.log(result);
  
  
