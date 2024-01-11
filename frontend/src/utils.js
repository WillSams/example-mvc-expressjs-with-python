const isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) { return false; }
};

const validateRequiredFields = (fields, required) => required.every((field) => fields[field]);

const mergeMessages = (prefix, messages) => `${prefix}: ${messages.join(' - ')}`;

export default { mergeMessages, isJSON, validateRequiredFields };

