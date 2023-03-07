import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import { myCache } from "../data/receiptData.js";

const controller = {};

const isRoundDollar = (totalStr) => {
  const regex = /^([1-9]\d*|\d)(\.00)?$/;
  return regex.test(totalStr);
};
const retailerNamePoints = (retailerName) => {
  const alphaNumericChars = retailerName.replace(/[^0-9a-z]/gi, "");
  return alphaNumericChars.length;
};
const isMultipleCents = (totalStr) => {
  const regex = /^([1-9]\d*|\d)(\.25|\.50|\.75|\.00)*$/;
  return regex.test(totalStr);
};
const isOddDate = (purchaseDate) => {
  const dateObj = DateTime.fromISO(purchaseDate, {
    zone: "America/Los_Angeles",
  });
  const dayOfMonth = dateObj.day;
  return dayOfMonth % 2 !== 0;
};
const isAfternoon = (purchaseTime) => {
  const [hours, minutes] = purchaseTime.split(":");
  const hoursNum = parseInt(hours, 10);
  const minutesNum = parseInt(minutes, 10);
  return hoursNum >= 14 && hoursNum < 16;
};
const isMultipleOfThree = (receiptList) => {
  let totalPoints = 0;
  receiptList.forEach((item) => {
    const trimmedLength = item.shortDescription.trim().length;
    if (trimmedLength % 3 === 0) {
      const pointsEarned = Math.ceil(item.price * 0.2);
      totalPoints += pointsEarned;
    }
  });
  return totalPoints;
};

// Calculates points associated with each receipt payload
controller.calculateReceipt = (req, res, next) => {
  try {
    let { retailer, purchaseDate, purchaseTime, items, total } = req.body;
    let namePoints = retailerNamePoints(retailer);
    let multipleOfThreePoints = isMultipleOfThree(items);
    let roundDollarPoints = 50;
    let multiplePoints = 0;
    let oddDatePoints = 0;
    let isAfternoonPoints = 0;
    let pairsCount = Math.floor(items.length / 2);
    let pairPoints = pairsCount * 5;
    isRoundDollar(total) 
      ? (roundDollarPoints = 50) 
      : (roundDollarPoints = 0);
    isMultipleCents(total) 
      ? (multiplePoints = 25) 
      : (multiplePoints = 0);
    isOddDate(purchaseDate) 
      ? (oddDatePoints = 6) 
      : (oddDatePoints = 0);
    isAfternoon(purchaseTime)
      ? (isAfternoonPoints = 10)
      : (isAfternoonPoints = 0);
    let totalPoints =
      roundDollarPoints +
      isAfternoonPoints +
      namePoints +
      oddDatePoints +
      multiplePoints +
      pairPoints +
      multipleOfThreePoints;
    res.locals.receiptPoints = totalPoints;
    return next();
  } catch (err) {
    console.log('Error in calculating points');
    return next(err);
  }
};

// Stores points associated with payload to node-cache object
controller.storePoints = (req, res, next) => {
  try {
    const newID = uuidv4();
    res.locals.receiptID = newID;
    const id = { id: newID };
    res.locals.receiptObject = id;
    const success = myCache.set(res.locals.receiptID, res.locals.receiptPoints);
    return next();
  } catch (err) {
    console.log("Error in storePoints");
    return next(err);
  }
};

// Retrieve points associated with ID from node-cache
controller.getPoints = (req, res, next) => {
  try {
    const value = myCache.get(req.params.id);
    if (value === undefined) {
      console.log("undefined!");
    }
    console.log(value);
    res.locals.points = { points: value };
    return next();
  } catch (err) {
    console.log("Error in getPoints");
    return next(err);
  }
};

export default controller;
