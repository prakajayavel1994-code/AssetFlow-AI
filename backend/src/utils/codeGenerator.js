const generateCode = async (Model, prefix) => {
  const count = await Model.countDocuments();
  const next = String(count + 1).padStart(4, '0');
  return `${prefix}-${next}`;
};

module.exports = generateCode;
