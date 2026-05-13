async function twilioService() {
  return await client.verify.v2.services.create({
    friendlyName: "My First Verify Service",
  });
}

export default twilioService;

// One-time
