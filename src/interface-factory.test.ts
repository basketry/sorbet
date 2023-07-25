import { readFileSync } from 'fs';
import { join } from 'path';
import { generateTypes } from './interface-factory';

const pkg = require('../package.json');
const withVersion = `${pkg.name}@${pkg.version}`;
const withoutVersion = `${pkg.name}@{{version}}`;

describe('InterfaceFactory', () => {
  it('recreates a valid snapshot', () => {
    // ARRANGE
    const service = require('basketry/lib/example-ir.json');

    // ACT
    const int = generateTypes(service, {
      sorbet: {
        typesModule: 'types',
        enumsModule: 'enums',
        magicComments: ['frozen_string_literal: true'],
      },
    });

    // ASSERT
    for (const file of [...int]) {
      const path = join('src', 'snapshot', ...file.path);
      const snapshot = readFileSync(path)
        .toString()
        .replace(withoutVersion, withVersion);
      expect(file.contents).toStrictEqual(snapshot);
    }
  });

  describe('when the ServiceLocator file is excluded', () => {
    it('does not include the ServiceLocator file', () => {
      // ARRANGE
      const service = require('basketry/lib/example-ir.json');

      // ACT
      const int = generateTypes(service, {
        sorbet: {
          typesModule: 'types',
          enumsModule: 'enums',
          magicComments: ['frozen_string_literal: true'],
        },
        basketry: {
          exclude: ['ServiceLocator'],
        },
      });

      // ASSERT
      for (const file of [...int]) {
        expect(file.path.join('/')).not.toContain('service_locator.rb');
      }
    });
  });
});
