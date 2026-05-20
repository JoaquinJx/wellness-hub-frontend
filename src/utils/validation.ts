// Input validation utilities for wellness app forms
export const inputValidators = {
  // Only allow numbers (including decimals)
  numericOnly: (value: string) => {
    return value.replace(/[^0-9.]/g, '');
  },

  // Only allow letters and numbers (alphanumeric)
  alphanumericOnly: (value: string) => {
    return value.replace(/[^a-zA-Z0-9\s]/g, '');
  },

  // Only allow letters, numbers, and common punctuation for notes
  textOnly: (value: string) => {
    return value.replace(/[^a-zA-Z0-9\s.,!?-]/g, '');
  },

  // Validate numeric input on change
  handleNumericInput: (_currentValue: string, newValue: string) => {
    const cleaned = inputValidators.numericOnly(newValue);
    return cleaned;
  },

  // Validate alphanumeric input on change
  handleAlphanumericInput: (_currentValue: string, newValue: string) => {
    const cleaned = inputValidators.alphanumericOnly(newValue);
    return cleaned;
  },

  // Validate text input on change
  handleTextInput: (_currentValue: string, newValue: string) => {
    const cleaned = inputValidators.textOnly(newValue);
    return cleaned;
  }
};
