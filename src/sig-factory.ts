import {
  Interface,
  isRequired,
  Method,
  Parameter,
  ReturnType,
  Service,
} from 'basketry';
import {
  buildMethodName,
  buildParameterName,
  buildTypeName,
} from './name-factory';
import { NamespacedSorbetOptions } from './types';
import {
  BlockFunction,
  CommentFunction,
  Contents,
  Formatter,
  IndentFunction,
} from './utils';

export class SigFactory {
  constructor(
    private readonly method: Method,
    private readonly service: Service,
    private readonly options: NamespacedSorbetOptions | undefined,
    formatter: Formatter,
    private readonly contents?: Contents,
  ) {
    this.block = formatter.block;
    this.comment = formatter.comment;
    this.indent = formatter.indent;
  }

  private readonly comment: CommentFunction;
  private readonly block: BlockFunction;
  private readonly indent: IndentFunction;

  *build(): Iterable<string> {
    if (!this.contents) yield* this.buildYardDoc(this.method);
    yield* this.buildSignature(this.method);
    yield* this.buildDefinition(this.method);
  }

  private *buildSignature(method: Method): Iterable<string> {
    const self = this;

    const mode = this.contents ? 'override' : 'abstract';

    if (method.returnType) {
      const typeName = buildTypeName({
        type: method.returnType!,
        service: this.service,
        options: this.options,
      });

      if (method.parameters.length) {
        yield* this.block('sig do', function* () {
          yield `${mode}.params(`;
          yield* self.buildSignatureParameters(method);
          yield `).returns(`;
          yield* self.indent(typeName);
          yield `)`;
        });
      } else {
        yield `sig { ${mode}.returns(${typeName}) }`;
      }
    } else {
      if (method.parameters.length) {
        yield* this.block('sig do', function* () {
          yield `${mode}.params(`;
          yield* self.buildSignatureParameters(method);
          yield ').void';
        });
      } else {
        yield `sig { ${mode}.void }`;
      }
    }
  }

  private *buildSignatureParameters(method: Method): Iterable<string> {
    yield* this.indent(
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

  private *buildYardDoc(method: Method): Iterable<string> {
    if (method.description || method.parameters.length || method.returnType) {
      yield* this.comment();
    }
    if (method.description) {
      if (Array.isArray(method.description)) {
        let first = false;
        for (const line of method.description) {
          if (first) first = false;
          else yield* this.comment();
          yield* this.comment(line.value);
        }
      } else {
        yield* this.comment(method.description.value);
      }
    }
    if (method.parameters.length) {
      if (method.description) yield* this.comment();

      for (const param of method.parameters) {
        yield* this.comment(
          `@param [${this.buildParameterType(param)}] ${buildParameterName(
            param,
          )}${this.buildParameterDescription(param)}`,
        );
      }
    }
    if (method.returnType) {
      if (method.description || method.parameters.length) yield* this.comment();

      yield* this.comment(
        `@return [${this.buildReturnType(method.returnType)}]`,
      );
    }
    if (method.description || method.parameters.length || method.returnType) {
      yield* this.comment();
    }
  }

  private buildParameterType(param: Parameter): string {
    const baseType = buildTypeName({
      type: param,
      options: this.options,
      service: this.service,
      skipArrayify: true,
    });

    const arrayified = param.isArray ? `Array<${baseType}>` : baseType;

    return isRequired(param) ? arrayified : `${arrayified}, nil`;
  }

  private buildReturnType(param: ReturnType): string {
    const baseType = buildTypeName({
      type: param,
      options: this.options,
      service: this.service,
      skipArrayify: true,
    });

    return param.isArray ? `Array<${baseType}>` : baseType;
  }

  private buildParameterDescription(param: Parameter): string {
    if (!param.description) {
      return '';
    } else if (Array.isArray(param.description)) {
      if (param.description.length) {
        return ` ${param.description.map((d) => d.value).join(' ')}`;
      } else {
        return '';
      }
    } else {
      if (param.description.value.length) {
        return ` ${param.description.value}`;
      } else {
        return '';
      }
    }
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

    yield* this.block(
      `def ${buildMethodName(method)}${parameters}`,
      this.contents || [],
    );
  }
}

function sortParameters(parameters: Parameter[]): Parameter[] {
  return [...parameters].sort(
    (a, b) => (isRequired(a) ? 0 : 1) - (isRequired(b) ? 0 : 1),
  );
}
