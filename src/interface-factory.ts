import {
  Enum,
  File,
  Generator,
  Interface,
  isRequired,
  Literal,
  Method,
  Parameter,
  Service,
  Type,
} from 'basketry';
import { constant, pascal, snake } from 'case';
import {
  buildServiceLocatorFilepath,
  buildServiceLocatorName,
  buildServiceLocatorNamespace,
} from '.';
import {
  buildEnumFilepath,
  buildEnumNamespace,
  buildInterfaceFilepath,
  buildInterfaceName,
  buildInterfaceNamespace,
  buildMethodName,
  buildParameterName,
  buildPropertyName,
  buildTypeFilepath,
  buildTypeName,
  buildTypeNamespace,
} from './name-factory';

import { NamespacedSorbetOptions } from './types';
import { warning } from './warning';

export const generateTypes: Generator = (
  service,
  options?: NamespacedSorbetOptions,
) => {
  return new Builder(service, options).build();
};

class Builder {
  constructor(
    private readonly service: Service,
    private readonly options?: NamespacedSorbetOptions,
  ) {}

  build(): File[] {
    const interfaceFiles = this.service.interfaces.map((int) =>
      this.buildInterfaceFile(int),
    );

    const typeFiles = this.service.types.map((type) =>
      this.buildTypeFile(type),
    );

    const enumFiles = this.service.enums.map((e) => this.buildEnumFile(e));

    return [
      ...interfaceFiles,
      ...typeFiles,
      ...enumFiles,
      this.buildServiceLocatorFile(),
    ];
  }

  private warning() {
    return warning(this.service, require('../package.json'), this.options);
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

  private *magicComments(): Iterable<string> {
    if (this.options?.sorbet?.magicComments?.length) {
      for (const magicComment of this.options.sorbet.magicComments) {
        yield `# ${magicComment}`;
      }
      yield '';
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
    yield this.warning();
    yield '';

    yield* this.magicComments();

    yield '# typed: strict';
    yield '';

    if (this.options?.sorbet?.magicComments?.length) {
      for (const magicComment of this.options.sorbet.magicComments) {
        yield `# ${magicComment}`;
      }
      yield '';
    }

    if (this.options?.sorbet?.fileIncludes?.length) {
      for (const include of this.options.sorbet.fileIncludes) {
        yield `require '${include}'`;
      }
      yield '';
    }

    const methods = [...int.methods].sort((a, b) =>
      a.name.value.localeCompare(b.name.value),
    );

    yield* this.comment(int.description);
    yield* block(
      `module ${buildInterfaceNamespace(this.service, this.options)}`,
      block(`module ${buildInterfaceName(int)}`, function* () {
        yield 'extend T::Sig';
        yield 'extend T::Helpers';
        yield '';
        yield 'interface!';
        for (const method of methods) {
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
      const typeName = buildTypeName({
        type: method.returnType!,
        service: this.service,
        options: this.options,
      });

      if (method.parameters.length) {
        yield* block('sig do', function* () {
          yield 'abstract.params(';
          yield* self.buildSignatureParameters(method);
          yield `).returns(`;
          yield* indent(typeName);
          yield `)`;
        });
      } else {
        yield `sig { abstract.returns(${typeName}) }`;
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
      sortParameters(method.parameters).map((param, i) => {
        const comma = i === method.parameters.length - 1 ? '' : ',';
        const typeName = buildTypeName({
          type: param,
          service: this.service,
          options: this.options,
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
      ? `(${sortParameters(method.parameters)
          .map(
            (param) =>
              `${buildParameterName(param)}:${isRequired(param) ? '' : ' nil'}`,
          )
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
    yield this.warning();
    yield '';

    yield* this.magicComments();

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
              const typeName = buildTypeName({
                type: property,
                service: self.service,
                options: self.options,
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
    yield this.warning();
    yield '';

    yield* this.magicComments();

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

  private buildServiceLocatorFile(): File {
    return {
      path: buildServiceLocatorFilepath(this.service, this.options),
      contents: from(this.buildServiceLocator()),
    };
  }

  private *buildServiceLocator(): Iterable<string> {
    const self = this;
    yield this.warning();
    yield '';

    if (this.options?.sorbet?.magicComments?.length) {
      for (const magicComment of this.options.sorbet.magicComments) {
        yield `# ${magicComment}`;
      }
      yield '';
    }

    yield '# typed: strict';
    yield '';

    const versionedModule = buildServiceLocatorNamespace(
      this.service,
      this.options,
    );

    yield* block(`module ${versionedModule}`, function* () {
      yield* block(`module ${buildServiceLocatorName()}`, function* () {
        yield `extend T::Sig`;
        yield `extend T::Helpers`;
        yield '';
        yield `interface!`;
        for (const int of self.service.interfaces) {
          const interfaceName = buildInterfaceName(int);
          yield '';
          yield `sig { abstract.returns(${buildInterfaceNamespace(
            self.service,
            self.options,
          )}::${interfaceName}) }`;
          yield `def ${snake(interfaceName)}`;
          yield 'end';
        }
      });
    });

    yield '';
    yield `# The following template can be used to create an implementation of the ${buildServiceLocatorName()}.`;
    yield `# Note that if the original service definition is updated, this template may also be`;
    yield `# updated; however, your implementation will remain as-is. In such a case, you will need`;
    yield `# to manually update your implementation to match the ${buildServiceLocatorName()} interface.`;
    yield '';

    yield* comment(function* () {
      yield* block(`class TemplateServiceLocator`, function* () {
        yield `extend T::Sig`;
        yield '';
        yield `include ${buildServiceLocatorNamespace(
          self.service,
          self.options,
        )}::${buildServiceLocatorName()}`;
        for (const int of self.service.interfaces) {
          const interfaceName = buildInterfaceName(int);
          yield '';
          yield `sig { override.returns(${buildInterfaceNamespace(
            self.service,
            self.options,
          )}::${interfaceName}) }`;
          yield `def ${snake(interfaceName)}`;
          yield* indent(`raise NotImplementedError`);
          yield 'end';
        }
      });
    });

    yield '';
  }
}

function sortParameters(parameters: Parameter[]): Parameter[] {
  return [...parameters].sort(
    (a, b) => (isRequired(a) ? 0 : 1) - (isRequired(b) ? 0 : 1),
  );
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

function* comment(
  lines: Iterable<string> | (() => Iterable<string>),
): Iterable<string> {
  for (const line of typeof lines === 'function' ? lines() : lines) {
    yield line.length ? `# ${line}` : '#';
  }
}
