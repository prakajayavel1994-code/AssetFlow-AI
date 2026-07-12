const predictMaintenance = async (asset) => {
  return {
    prediction: 'maintenance-needed',
    confidence: 0.87,
    recommendation: `Inspect ${asset?.assetName || 'the asset'} before the next scheduled service.`
  };
};

const chatAssistant = async (message) => {
  return {
    reply: `Mock AI response to: ${message}`
  };
};

module.exports = { predictMaintenance, chatAssistant };
