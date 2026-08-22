const functionHandlers = {
  NotifyVendorOnOrder: async (input) => {
    return {
      vendorId: `vendor-${input.orderId}`,
      notified: true,
    };
  },

  SendOrderConfirmation: async (input) => {
    return {
      orderId: input.orderId,
      invoiceId: input.invoiceId,
      notified: true,
    };
  },
};

async function runFunction(functionName, input) {
  const handler = functionHandlers[functionName];

  if (!handler) {
    throw new Error(
      `No executable handler found for: ${functionName}`
    );
  }

  return handler(input);
}

module.exports = runFunction;