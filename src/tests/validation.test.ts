import { describe, it, expect } from 'vitest';
import { inputValidators } from '../utils/validation';

describe('inputValidators', () => {
  describe('numericOnly', () => {
    it('strips non-numeric characters', () => {
      expect(inputValidators.numericOnly('abc123.5')).toBe('123.5');
    });

    it('preserves decimal numbers', () => {
      expect(inputValidators.numericOnly('70.5')).toBe('70.5');
    });

    it('returns empty string for all-letter input', () => {
      expect(inputValidators.numericOnly('abc')).toBe('');
    });
  });

  describe('alphanumericOnly', () => {
    it('strips special characters but keeps letters and numbers', () => {
      expect(inputValidators.alphanumericOnly('abc!@#123')).toBe('abc123');
    });

    it('preserves spaces', () => {
      expect(inputValidators.alphanumericOnly('hello world')).toBe('hello world');
    });
  });

  describe('textOnly', () => {
    it('strips uncommon special characters', () => {
      expect(inputValidators.textOnly('Hello @World!')).toBe('Hello World!');
    });

    it('preserves common punctuation', () => {
      expect(inputValidators.textOnly('Good morning, how are you?')).toBe('Good morning, how are you?');
    });
  });

  describe('handleNumericInput', () => {
    it('cleans and returns only numeric value', () => {
      expect(inputValidators.handleNumericInput('', 'abc123')).toBe('123');
    });
  });
});
