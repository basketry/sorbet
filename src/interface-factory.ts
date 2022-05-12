import {
  Enum,
  File,
  Generator,
  Interface,
  isRequired,
  Literal,
  Method,
  Parameter,
  Property,
  ReturnType,
  Service,
  Type,
} from 'basketry';
import { constant, pascal, snake } from 'case';
import {
  buildEnumFilepath,
  buildEnumNamespace,
  buildInterfaceFilepath,
  buildInterfaceName,
  buildInterfaceNamespace,
  buildMethodName,
  buildNamespace,
  buildParameterName,
  buildPropertyName,
  buildTypeFilepath,
  buildTypeNamespace,
} from './name-factory';

import { SorbetOptions } from './types';
import { warning } from './warning';

export const generateTypes: Generator = (service, options?: SorbetOptions) => {
  return new Builder(service, options).build();
};

class Builder {
  constructor(
    private readonly service: Service,
    private readonly options?: SorbetOptions,
  ) {}

  build(): File[] {
    const interfaceFiles = this.service.interfaces.map((int) =>
      this.buildInterfaceFile(int),
    );

    const typeFiles = this.service.types.map((type) =>
      this.buildTypeFile(type),
    );

    const enumFiles = this.service.enums.map((e) => this.buildEnumFile(e));

    return [...interfaceFiles, ...typeFiles, ...enumFiles];
  }

  private *comment(
    text: string | Literal<string> | Literal<string>[] | undefined,
  ): Iterable<string> {
    if (Array.isArray(text)) {
      for (const line of text) yield* this.comment(line);
    } else if (typeof text === 'string') {
      yield `# ${text}`;
    } else if (text) {
      yield `# ${text.value}`;
    }
  }

  private buildInterfaceFile(int: Interface): File {
    return {
      path: buildInterfaceFilepath(int, this.service, this.options),
      contents: from(this.buildInterface(int)),
    };
  }

  private *buildInterface(int: Interface): Iterable<string> {
    const self = this;
    yield warning;
    yield '';

    yield '# typed: strict';
    yield '';

    if (this.options?.sorbet?.fileIncludes?.length) {
      for (const include of this.options.sorbet.fileIncludes) {
        yield `require '${include}'`;
      }
      yield '';
    }

    yield* this.comment(int.description);
    yield* block(
      `module ${buildInterfaceNamespace(this.service, this.options)}`,
      block(`module ${buildInterfaceName(int)}`, function* () {
        yield 'extend T::Sig';
        yield 'extend T::Helpers';
        yield '';
        yield 'interface!';
        for (const method of int.methods) {
          yield '';
          yield* self.comment(method.description);
          yield* self.buildSignature(method);
          yield* self.buildDefinition(method);
        }
      }),
    );

    yield '';
  }

  private *buildSignature(method: Method): Iterable<string> {
    const self = this;

    if (method.returnType) {
      const typeName = self.buildTypeName({ type: method.returnType! });
      const returnType = isRequired(method.returnType!)
        ? typeName
        : `T.nilable(${typeName})`;

      if (method.parameters.length) {
        yield* block('sig do', function* () {
          yield 'abstract.params(';
          yield* self.buildSignatureParameters(method);
          yield `).returns(`;
          yield* indent(returnType);
          yield `)`;
        });
      } else {
        yield `sig { abstract.returns(${returnType}) }`;
      }
    } else {
      if (method.parameters.length) {
        yield* block('sig do', function* () {
          yield 'abstract.params(';
          yield* self.buildSignatureParameters(method);
          yield ').void';
        });
      } else {
        yield 'sig { abstract.void }';
      }
    }
  }

  private *buildSignatureParameters(method: Method): Iterable<string> {
    yield* indent(
      method.parameters.map((param, i) => {
        const comma = i === method.parameters.length - 1 ? '' : ',';
        const typeName = this.buildTypeName({
          type: param,
        });
        const nilableTypeName = isRequired(param)
          ? typeName
          : `T.nilable(${typeName})`;

        return `${buildParameterName(param)}: ${nilableTypeName}${comma}`;
      }),
    );
  }

  private *buildDefinition(method: Method): Iterable<string> {
    const parameters = method.parameters.length
      ? `(${method.parameters
          .map((param) => `${buildParameterName(param)}:`)
          .join(', ')})`
      : '';

    yield* block(`def ${buildMethodName(method)}${parameters}`, []);
  }

  private buildTypeFile(type: Type): File {
    return {
      path: buildTypeFilepath(type, this.service, this.options),
      contents: from(this.buildType(type)),
    };
  }

  private *buildType(type: Type): Iterable<string> {
    const self = this;
    yield warning;
    yield '';

    yield '# typed: strict';
    yield '';

    if (this.options?.sorbet?.fileIncludes?.length) {
      for (const include of this.options.sorbet.fileIncludes) {
        yield `require '${include}'`;
      }
      yield '';
    }

    yield* block(
      `module ${buildTypeNamespace(this.service, this.options)}`,
      function* () {
        yield* self.comment(type.description);
        yield* block(
          `class ${pascal(type.name.value)} < T::Struct`,
          function* () {
            let isFirst = true;
            for (const property of type.properties) {
              const typeName = self.buildTypeName({
                type: property,
              });

              if (!isFirst && property.description) yield '';
              yield* self.comment(property.description);
              yield `const :${buildPropertyName(property)}, ${
                isRequired(property) ? typeName : `T.nilable(${typeName})`
              }`;
              isFirst = false;
            }
          },
        );
      },
    );

    yield '';
  }

  private buildEnumFile(e: Enum): File {
    return {
      path: buildEnumFilepath(e, this.service, this.options),
      contents: from(this.buildEnum(e)),
    };
  }

  private *buildEnum(e: Enum): Iterable<string> {
    yield warning;
    yield '';

    yield '# typed: strict';
    yield '';

    if (this.options?.sorbet?.fileIncludes?.length) {
      for (const include of this.options.sorbet.fileIncludes) {
        yield `require '${include}'`;
      }
      yield '';
    }

    yield* block(
      `module ${buildEnumNamespace(this.service, this.options)}`,
      block(
        `class ${pascal(e.name.value)} < T::Enum`,
        block(`enums do`, function* () {
          for (const value of e.values) {
            yield `${constant(value.value)} = new('${snake(value.value)}')`;
          }
        }),
      ),
    );

    yield '';
  }

  private buildTypeName({
    type,
    skipArrayify = false,
  }: {
    type: Parameter | Property | ReturnType;
    skipArrayify?: boolean;
  }): string {
    const arrayify = (n: string) =>
      type.isArray && !skipArrayify ? `T::Array[${n}]` : n;

    if (type.isUnknown) {
      return arrayify('T.untyped');
    } else if (type.isLocal) {
      let moduleNamespace: string;
      if (
        this.service.types.some((t) => t.name.value === type.typeName.value)
      ) {
        moduleNamespace = buildTypeNamespace(this.service, this.options);
      } else {
        moduleNamespace = buildEnumNamespace(this.service, this.options);
      }

      return arrayify(`${moduleNamespace}::${pascal(type.typeName.value)}`);
    }

    switch (type.typeName.value) {
      case 'string':
        return arrayify('String');
      case 'number':
        return arrayify('Numeric');
      case 'integer':
        return arrayify('Integer');
      case 'boolean':
        return arrayify('T::Boolean');
      default:
        return arrayify('T.untyped');
    }
  }
}

function from(lines: Iterable<string>): string {
  return Array.from(lines).join('\n');
}

let indentCount = 0;

function* block(
  line: string,
  body: string | Iterable<string> | (() => Iterable<string>),
): Iterable<string> {
  yield line;
  yield* indent(body);
  yield 'end';
}

function* indent(
  lines: string | Iterable<string> | (() => Iterable<string>),
): Iterable<string> {
  try {
    indentCount++;
    for (const line of typeof lines === 'function'
      ? lines()
      : typeof lines === 'string'
      ? [lines]
      : lines) {
      yield line.trim().length
        ? `${'  '.repeat(indentCount)}${line.trim()}`
        : '';
    }
  } finally {
    indentCount--;
  }
}
