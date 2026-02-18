/**
 * Edge case: File without default export (should be ignored/error)
 * Tests: Error handling for missing handler
 */

export const someUtility = () => {
  return "This is not a route handler";
};

// No default export - this should cause an error
