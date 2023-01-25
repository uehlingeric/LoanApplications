/* Eric Uehling
 * 11.3.2022
 * 
 * Usage (in terminal, in immediate directory): node index
 * 
 * Description: Reads payments.csv and db.json to produce 
 *              applied.json with fields username,
 *              applied, and owe.
 */
const fs = require('fs');

/* Returns string value of csv file. */
function readCSV(filename = '""') {
    if (fs.existsSync(filename)) 
        return fs.readFileSync(filename).toString();
    else return ('""');
}

/* Returns array value of json file. */
function readJSON(filename = '""') {
    if (fs.existsSync(filename)) 
        return JSON.parse(fs.readFileSync(filename).toString());
    else return JSON.parse('""');
}

/* Creates json file with data parameter. */
function writeJSON(filename = '', json = '""') {
    return fs.writeFileSync(filename, JSON.stringify(json, null, 2));
}

/* Checks for match with dbData and a payment.
 * Returns the dbData index of match if found, -1 otherwise.
 */
function findUserIndex(dbData = [], singlePayment = []) {
    for(let i = 0; i < dbData.length; i++) {
        if (dbData[i].employer == singlePayment[0]
             && dbData[i].firstName == singlePayment[3]
             && dbData[i].lastName == singlePayment[4]) {
                var dbMask = dbData[i].mask;
                // removes asterisks
                var payMask = singlePayment[2].split("*").join(""); 
                if (payMask == "" || dbMask == payMask) return i;
        }
    }
    return -1;
}

/* Checks whether payment is first time or repeated. 
 * Returns index of initial payment if repeated, -1 otherwise.
 */
function findAppliedIndex(appliedData = [], singleDB = []) {
    for (let i = 0; i < appliedData.length; i++) {
        if (appliedData[i].username == singleDB.username) return i;
    }
    return -1;
}

const dbData = readJSON('db.json'); // stores data from db.json
const csvData = readCSV('payments.csv'); // stores data from payments.csv
const payments = csvData.split(/\r?\n/); // splits data by line

var appliedData = [];

for (let i = 1; i < payments.length; i++) { // indexes at 1 to skip headers
    const singlePayment = payments[i].split(',');
    const dbIndex = findUserIndex(dbData, singlePayment);
    if (dbIndex == -1) continue; // no match found

    const appliedIndex = findAppliedIndex(appliedData, dbData[dbIndex]);
    if (appliedIndex == -1) { // first payment for user
        const applied = {"username": dbData[dbIndex].username, 
        "applied": parseFloat(singlePayment[1]), 
        "owe": parseFloat(dbData[dbIndex].amountExpected)
         - parseFloat(singlePayment[1])};
        appliedData.push(applied);
    }
    else { // not first payment for user
        appliedData[appliedIndex].applied += parseFloat(singlePayment[1]);
        appliedData[appliedIndex].owe -= parseFloat(singlePayment[1]);
    }
}

writeJSON('applied.json', appliedData); // creates applied.json file