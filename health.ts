import frisby from 'frisby';

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
    response = await frisby.get('http://localhost:4000/health');

    if (!response) {
      return await retry();
    }

    const json = response.json;
  
    if (!json.postgresHealthy) {
      return await retry();
    }

    console.log('Up and ready!');

    return;
  } catch (error) {
    console.log('An error occurred', error);

    await retry();
  }
}

isAppUpAndReady();
