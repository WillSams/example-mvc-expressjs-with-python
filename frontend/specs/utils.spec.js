import utils from '../src/utils';

describe('Utils', () => {
  describe('isJSON', () => {
    it('should return true for valid JSON string', () => {
      const validJSON = '{"key": "value"}';
      expect(utils.isJSON(validJSON)).toBe(true);
    });

    it('should return false for invalid JSON string', () => {
      const invalidJSON = 'not a valid JSON';
      expect(utils.isJSON(invalidJSON)).toBe(false);
    });
  });

  describe('validateRequiredFields', () => {
    it('should return true when all required fields are present', () => {
      const fields = { name: 'John', age: 25, email: 'john@example.com' };
      const required = ['name', 'age', 'email'];
      expect(utils.validateRequiredFields(fields, required)).toBe(true);
    });

    it('should return false when at least one required field is missing', () => {
      const fields = { name: 'John', age: 25 };
      const required = ['name', 'age', 'email'];
      expect(utils.validateRequiredFields(fields, required)).toBe(false);
    });
  });

  describe('mergeMessages', () => {
    it('should merge messages with the specified prefix', () => {
      const prefix = 'Error';
      const messages = ['Invalid input', 'Please try again'];
      const merged = utils.mergeMessages(prefix, messages);
      expect(merged).toBe('Error: Invalid input - Please try again');
    });
  });
});
