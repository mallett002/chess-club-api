const services = [
  {serviceName: 'chess-club-api', url: 'http://localhost:4000/health', isUp: false}
];

async function isAppUpAndReady(startMethod) {
  // tag: DOCKER_START || DOCKER_INFRA
  // get the services with the right startMethods
  const servicesToRequest = services.filter((service) => service.startMethods.includes(startMethod));

  for (service of servicesToRequest) {
    const response = await frisby.get(service.url);

    if (response.status === 200) {
      service.isUp = true;
    }
  }

  // get the ones that still aren't up
  const servicesStillNotUp = services.filter((service) => !service.isUp);

  if (servicesStillNotUp.length) {

  }
}

const foundMethod = process.argv[2] || DOCKER_START;

if (foundMethod !== DOCKER_INFRA || foundMethod !== DOCKER_START) {
  throw new Error('Unrecognized start method');
}

isAppUpAndReady(foundMethod).then(() => {
  console.log('Up and ready!');
});
