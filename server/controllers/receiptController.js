const NodeCache = require("node-cache");
const { v4: uuidv4 } = require("uuid");

const myCache = new NodeCache();
const controller = {};

const isRoundDollar = (totalStr) => {
    const regex = /^([1-9]\d*|\d)(\.00)?$/;
    return regex.test(totalStr);
}

const retailerNamePoints = (retailerName) => {
    const alphaNumericChars = retailerName.replace(/[^0-9a-z]/gi, '');
    return(alphaNumericChars.length);
}

const isMultipleCents = (totalStr) => {
    const regex = /^([1-9]\d*|\d)(\.25|\.50|\.75|\.00)*$/;
    return regex.test(totalStr);
}

const isOddDate = (purchaseDate) => {
    const dateObj = new Date(purchaseDate);
    console.log('purchaseDate: ' + purchaseDate);
    console.log('dateObj: ' + dateObj)
    const dayOfMonth = dateObj.getDate();
    console.log('dayOfMonth: ' + dayOfMonth)
    return dayOfMonth%2 !== 0;
}

const isAfternoon = (purchaseTime) => {
    const [hours, minutes] = purchaseTime.split(":");
    const hoursNum = parseInt(hours, 10);
    const minutesNum = parseInt(minutes, 10);
    return hoursNum >= 14 && hoursNum < 16;
}

const isMultipleOfThree = (receiptList) => {
    let totalPoints = 0;
    receiptList.forEach(item => {
        const trimmedLength = item.shortDescription.trim().length;
        if (trimmedLength %3 === 0){
            const pointsEarned = Math.ceil(item.price*0.2);
            totalPoints += pointsEarned;
        }
    })
    return totalPoints;
}
controller.calculateReceipt = (req, res, next) => {
  console.log("calculate receipt middleware");
  try {
    let { retailer, purchaseDate, purchaseTime, items, total } = req.body;
    // Calculate alphanumericchars
    let namePoints = retailerNamePoints(retailer);
    // Calculate round dollar points
    let roundDollarPoints = 50;
    (isRoundDollar(total)) ? roundDollarPoints = 50 : roundDollarPoints = 0;
    // Calculate 0.25 multiple points
    let multiplePoints = 0;
    (isMultipleCents(total)) ? multiplePoints = 25 : multiplePoints = 0;
    // Calculate pairPoints
    const pairsCount = Math.floor(items.length/2)
    let pairPoints = pairsCount*5
    // Calculate oddDatePoints
    let oddDatePoints = 0;
    (isOddDate(purchaseDate)) ? oddDatePoints = 6 : oddDatePoints = 0;
    // Calculate isAfterNoon Points 
    let isAfternoonPoints = 0;
    (isAfternoon(purchaseTime)) ? isAfternoonPoints = 10 : isAfternoonPoints = 0;
    // Calculate multipleOfThree Points 
    let multipleOfThreePoints = isMultipleOfThree(items);
    console.log('RoundDollarPoints: ' + roundDollarPoints);
    console.log('retailerNamePoints: ' + namePoints);
    console.log('isMultipleCents: ' + multiplePoints);
    console.log('pairPoints: ' + pairPoints);
    console.log('isOddDatePoints: ' + oddDatePoints);
    console.log('isAfterNoonPoints: ' + isAfternoonPoints);
    console.log('multipleOfThreePoints: ' + multipleOfThreePoints);
    let totalPoints = roundDollarPoints + isAfternoonPoints + namePoints + oddDatePoints + multiplePoints + pairPoints + multipleOfThreePoints;
    console.log('total: ' + totalPoints)
    return next();
  } catch (err) {
    console.log(err);
  }
};

controller.storePoints = (req, res, next) => {
  const newID = uuidv4();
  res.locals.receiptID = newID;
  const id = { id: newID };
  res.locals.receiptObject = id;
  console.log("store points middleware");
  return next();
};

module.exports = controller;
