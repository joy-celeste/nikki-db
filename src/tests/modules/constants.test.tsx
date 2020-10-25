import { SUBTYPES, SUBTYPES_LIST } from '../../modules/constants';

describe('Subtypes constant', () => {
  test('Assert that the elements in SUBTYPES_LIST is specified by SUBTYPES', () => {
    const subtypesSet = new Set(SUBTYPES_LIST);
    expect(SUBTYPES_LIST).toHaveLength(Object.keys(SUBTYPES_LIST).length);
    Object.values(SUBTYPES).forEach((subtype: number) => {
      expect(subtypesSet.has(subtype)).toBe(true);
    });
  });
});
