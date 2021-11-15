const fetch = require('node-fetch');

const maxRetries = 20;
const backOffInMilis = 500;

let retryCount = 0;

async function retry() {
  retryCount++;

  if (retryCount > maxRetries) {
    console.log('chess-club-api did not come up....');
    process.exit(1);
  }
  
  console.log(`Retrying chess-club-api /health ${retryCount}/${maxRetries}`);

  const exponentialBackOff = backOffInMilis * retryCount;

  setTimeout(async () => await isAppUpAndReady(), exponentialBackOff);
  
}

async function isAppUpAndReady() {
  let response;
  
  try {
    response = await fetch('http://localhost:4000/health');

    if (!response.ok) {
      await retry();
    }

    const json = await response.json();
  
    if (!json.postgresHealthy) {
      await retry();
    }

    return;
  } catch (error) {
    await retry();
  }
}

isAppUpAndReady();
