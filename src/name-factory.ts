import {
  Enum,
  Interface,
  Method,
  Parameter,
  Property,
  ReturnType,
  Service,
  Type,
} from 'basketry';
import { pascal, snake } from 'case';

import { SorbetOptions } from './types';

export function buildNamespace(
  subModule: string | undefined,
  service: Service,
  options?: SorbetOptions,
): string {
  const segments: string[] = [];

  segments.push(service.title.value);

  if (options?.sorbet?.includeVersion !== false) {
    segments.push(`v${service.majorVersion.value}`);
  }

  if (subModule) {
    segments.push(subModule);
  }

  return segments.map(pascal).join('::');
}

export function buildInterfaceName(int: Interface): string {
  return pascal(`${int.name}_service`);
}
export function buildInterfaceNamespace(
  service: Service,
  options?: SorbetOptions,
): string {
  return buildNamespace(options?.sorbet?.interfacesModule, service, options);
}
export function buildInterfaceFilepath(
  int: Interface,
  service: Service,
  options?: SorbetOptions,
): string[] {
  const namespace = buildInterfaceNamespace(service, options);

  return [
    ...namespace.split('::').map(snake),
    `${snake(buildInterfaceName(int))}.rb`,
  ];
}

export function buildTypeNamespace(
  service: Service,
  options?: SorbetOptions,
): string {
  return buildNamespace(options?.sorbet?.typesModule, service, options);
}
export function buildTypeFilepath(
  type: Type,
  service: Service,
  options?: SorbetOptions,
): string[] {
  const namespace = buildTypeNamespace(service, options);

  return [...namespace.split('::').map(snake), `${snake(type.name.value)}.rb`];
}
export function buildTypeName({
  type,
  service,
  options,
  skipArrayify = false,
}: {
  type: Parameter | Property | ReturnType;
  service: Service;
  options: SorbetOptions | undefined;
  skipArrayify?: boolean;
}): string {
  const arrayify = (n: string) =>
    type.isArray && !skipArrayify ? `T::Array[${n}]` : n;

  if (type.isPrimitive) {
    const override = options?.sorbet?.types?.[type.typeName.value];
    if (override) {
      return arrayify(override);
    }

    switch (type.typeName.value) {
      case 'null':
        return arrayify('nil');
      case 'string':
        return arrayify('String');
      case 'number':
        return arrayify('Numeric');
      case 'integer':
      case 'long':
        return arrayify('Integer');
      case 'float':
      case 'double':
        return arrayify('Float');
      case 'boolean':
        return arrayify('T::Boolean');
      case 'date':
        return arrayify('Date');
      case 'date-time':
        return arrayify('DateTime');
      case 'untyped':
        return arrayify('T.untyped');
      default:
        return arrayify('T.untyped');
    }
  } else {
    let moduleNamespace: string;
    if (service.types.some((t) => t.name.value === type.typeName.value)) {
      moduleNamespace = buildTypeNamespace(service, options);
    } else {
      moduleNamespace = buildEnumNamespace(service, options);
    }

    return arrayify(`${moduleNamespace}::${pascal(type.typeName.value)}`);
  }
}

export function buildEnumNamespace(
  service: Service,
  options?: SorbetOptions,
): string {
  return buildNamespace(options?.sorbet?.enumsModule, service, options);
}
export function buildEnumFilepath(
  e: Enum,
  service: Service,
  options?: SorbetOptions,
): string[] {
  const namespace = buildEnumNamespace(service, options);

  return [...namespace.split('::').map(snake), `${snake(e.name.value)}.rb`];
}

export function buildPropertyName(property: Property): string {
  return snake(property.name.value);
}

export function buildParameterName(parameter: Parameter): string {
  return snake(parameter.name.value);
}

export function buildMethodName(method: Method): string {
  return snake(method.name.value);
}
