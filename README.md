[![main](https://github.com/basketry/sorbet/workflows/build/badge.svg?branch=main&event=push)](https://github.com/basketry/sorbet/actions?query=workflow%3Abuild+branch%3Amain+event%3Apush)
[![master](https://img.shields.io/npm/v/@basketry/sorbet)](https://www.npmjs.com/package/@basketry/sorbet)

# Sorbet

[Basketry generator](https://github.com/basketry) for generating [Sorbet](https://sorbet.org/) types and interfaces. This parser can be coupled with any Basketry parser.

## Quick Start

The following example converts a "Swagger" doc into [Sorbet](https://sorbet.org/) types:

1. Save `https://petstore.swagger.io/v2/swagger.json` as `petstore.json` in the root of your project.
1. Install packages: `npm install -g basketry @basketry/swagger-2 @basketry/sorbet`
1. Generate code: `basketry --source petstore.json --parser @basketry/swagger-2 --generators @basketry/sorbet --output src`

When the last step is run, basketry will parse the source file (`petstore.json`) using the specified parser (`@basketry/swagger-2`) and then run each specified generator (in this case only `@basketry/sorbet`) writing the output folder (`src`).

## Folder Structure

This generator emits a folder structure suitable for loading classes with [Zeitwerk](https://github.com/fxn/zeitwerk). All files are written to the `/{title}/v{majorVersion}` subfolder within the output directory. The default structure can be customized using various options.

Example config without options:

```json
{
  "source": "petstore.json",
  "parser": "@basketry/swagger-2",
  "generators": ["@basketry/sorbet"],
  "output": "app/lib"
}
```

Resulting output:

```
my_project/
├─ app/
│  ├─ lib/
│  │  ├─ petstore/
│  │  │  ├─ v1/
│  │  │  │  ├─ some_enum_a.rb
│  │  │  │  ├─ some_enum_b.rb
│  │  │  │  ├─ some_interface_a.rb
│  │  │  │  ├─ some_interface_b.rb
│  │  │  │  ├─ some_type_a.rb
│  │  │  │  ├─ some_type_b.rb
│  │  ├─ .gitattributes
├─ basketry.config.json
├─ petstore.json
```

## Options

All sorbet generator options are namespaced within a `sorbet` property as shown in the following example config:

```json
{
  "source": "petstore.json",
  "parser": "@basketry/swagger-2",
  "generators": [
    {
      "rule": "@basketry/sorbet",
      "options": {
        "sorbet": {
          "includeVersion": false,
          "typesModule": "types",
          "enumsModule": "enums",
          "interfacesModule": "services",
          "types": {
            "number": "BigDecimal"
          }
        }
      }
    }
  ],
  "output": "app/lib"
}
```

### `includeVersion`

This option controls whether or not the files will be written into a `/v{majorVersion}` subfolder. The default is `true`.

Example usage:

```json
{
  "rule": "@basketry/sorbet",
  "options": {
    "sorbet": {
      "includeVersion": false
    }
  }
}
```

Resulting output:

```
my_project/
├─ app/
│  ├─ lib/
│  │  ├─ petstore/
│  │  │  ├─ some_enum_a.rb
│  │  │  ├─ some_enum_b.rb
│  │  │  ├─ some_interface_a.rb
│  │  │  ├─ some_interface_b.rb
│  │  │  ├─ some_type_a.rb
│  │  │  ├─ some_type_b.rb
│  │  ├─ .gitattributes
├─ basketry.config.json
├─ petstore.json
```

### `typesModule`

This option allows you to specify the sub-folder (and sub-module) for the emitted types. If this option is not supplied, types are written into the main project output folder.

```json
{
  "rule": "@basketry/sorbet",
  "options": {
    "sorbet": {
      "typesModule": "types"
    }
  }
}
```

Resulting output:

```
my_project/
├─ app/
│  ├─ lib/
│  │  ├─ petstore/
│  │  │  ├─ v1/
│  │  │  │  ├─ types/
│  │  │  │  │  ├─ some_type_a.rb
│  │  │  │  │  ├─ some_type_b.rb
│  │  │  │  ├─ some_enum_a.rb
│  │  │  │  ├─ some_enum_b.rb
│  │  │  │  ├─ some_interface_a.rb
│  │  │  │  ├─ some_interface_b.rb
│  │  ├─ .gitattributes
├─ basketry.config.json
├─ petstore.json
```

### `enumsModule`

This option allows you to specify the sub-folder (and sub-module) for the emitted types. If this option is not supplied, enums are written into the main project output folder.

```json
{
  "rule": "@basketry/sorbet",
  "options": {
    "sorbet": {
      "enumsModule": "enums"
    }
  }
}
```

Resulting output:

```
my_project/
├─ app/
│  ├─ lib/
│  │  ├─ petstore/
│  │  │  ├─ v1/
│  │  │  │  ├─ enums/
│  │  │  │  │  ├─ some_enum_a.rb
│  │  │  │  │  ├─ some_enum_b.rb
│  │  │  │  ├─ some_interface_a.rb
│  │  │  │  ├─ some_interface_b.rb
│  │  │  │  ├─ some_type_a.rb
│  │  │  │  ├─ some_type_b.rb
│  │  ├─ .gitattributes
├─ basketry.config.json
├─ petstore.json
```

### `interfacesModule`

This option allows you to specify the sub-folder (and sub-module) for the emitted types. If this option is not supplied, interfaces are written into the main project output folder.

```json
{
  "rule": "@basketry/sorbet",
  "options": {
    "sorbet": {
      "interfacesModule": "services"
    }
  }
}
```

Resulting output:

```
my_project/
├─ app/
│  ├─ lib/
│  │  ├─ petstore/
│  │  │  ├─ v1/
│  │  │  │  ├─ services/
│  │  │  │  │  ├─ some_interface_a.rb
│  │  │  │  │  ├─ some_interface_b.rb
│  │  │  │  ├─ some_enum_a.rb
│  │  │  │  ├─ some_enum_b.rb
│  │  │  │  ├─ some_type_a.rb
│  │  │  │  ├─ some_type_b.rb
│  │  ├─ .gitattributes
├─ basketry.config.json
├─ petstore.json
```

### `magicComments`

This option allows you to add magic comments to the files emitted by this generator.

```json
{
  "rule": "@basketry/sorbet",
  "options": {
    "sorbet": {
      "magicComments": ["frozen_string_literal: true"]
    }
  }
}
```

### `types`

This option allows you to specify overrides for various types.

The following example will cause the generator to emit `BigDecimal` (instead of the default `Numeric`) for the type `number`. Multiple type overrides may be specified.

```json
{
  "rule": "@basketry/sorbet",
  "options": {
    "sorbet": {
      "types": {
        "number": "BigDecimal"
      }
    }
  }
}
```

## Snapshots

An example of generated sorbet code can be found as a test snapshot at [`/src/snapshot/`](./src/snapshot/).

---

## For contributors:

### Run this project

1.  Install packages: `npm ci`
1.  Build the code: `npm run build`
1.  Run it! `npm start`

Note that the `lint` script is run prior to `build`. Auto-fixable linting or formatting errors may be fixed by running `npm run fix`.

### Create and run tests

1.  Add tests by creating files with the `.test.ts` suffix
1.  Run the tests: `npm t`
1.  Test coverage can be viewed at `/coverage/lcov-report/index.html`

### Publish a new package version

1. Ensure latest code is published on the `main` branch.
1. Create the new version number with `npm version {major|minor|patch}`
1. Push the branch and the version tag: `git push origin main --follow-tags`

The [publish workflow](https://github.com/basketry/sorbet/actions/workflows/publish.yml) will build and pack the new version then push the package to NPM. Note that publishing requires write access to the `main` branch.

---

Generated with [generator-ts-console](https://www.npmjs.com/package/generator-ts-console)
