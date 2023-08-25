/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {onCall} = require("firebase-functions/v2/https");

initializeApp();
const db = getFirestore();

exports.getDataAdmin = onCall(async (request)=>{
  console.log(request);
  let nofSleep = 0;
  let nofSteps = 0;
  let nofAreas = 0;
  let nofUsers = 0;
  const usersDb = db.collection("users");
  const users = await usersDb.get();
  const filterUsers = users.docs.filter((user)=>user.data()["role"]==="user");
  nofUsers = filterUsers.length;
  let sumSteps = 0;
  let sumSleep = 0;
  let sumArea = 0;

  for (const user of filterUsers) {
    const steps = user.data()["steps"];
    const sleep = user.data()["sleep"];
    const area = user.data()["time"];
    sumSteps += steps;
    sumSleep += sleep;
    sumArea += area;
  }
  nofSleep = sumSleep/nofUsers;
  nofSteps = sumSteps/nofUsers;
  nofAreas = sumArea/nofUsers;
  return {
    nofUsers: nofUsers,
    nofAreas: nofAreas,
    nofSleep: nofSleep,
    nofSteps: nofSteps,
  };
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
