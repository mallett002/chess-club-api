import fetch from 'node-fetch';

const maxRetries = 10;
const backOffInMilis = 500;

let retryCount = 0;

async function isAppUpAndReady() {
  const response = await fetch('http://localhost:4000/health');

  if (!response.ok) {
    retryCount++;

    if (retryCount > maxRetries) {
      throw new Error('chess-club-api did not come up.');
    }
    
    console.log(`Retrying chess-club-api /health ${retryCount}/${maxRetries}`);

    const exponentialBackOff = backOffInMilis * retryCount;

    setTimeout(async () => await isAppUpAndReady(), exponentialBackOff);
  }
}

isAppUpAndReady().then(() => {
  console.log('Up and ready!');
});
