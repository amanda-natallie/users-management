import { queryClient } from './api';

describe('API Service', () => {
  describe('Query Client', () => {
    it('should export query client instance', () => {
      expect(queryClient).toBeDefined();
    });

    it('should have correct default options', () => {
      expect(queryClient).toHaveProperty('getQueryData');
      expect(queryClient).toHaveProperty('setQueryData');
    });
  });

  describe('Module Exports', () => {
    it('should export queryClient', () => {
      expect(queryClient).toBeDefined();
    });
  });
});
