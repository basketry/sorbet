import {
  Enum,
  Interface,
  Method,
  Parameter,
  Property,
  Service,
  Type,
  TypedValue,
} from 'basketry';
import { pascal, snake } from 'case';
import { sep } from 'path';

import { NamespacedSorbetOptions } from './types';

export function buildNamespace(
  subModule: string | string[] | undefined,
  service: Service,
  options?: NamespacedSorbetOptions,
): string {
  const segments: string[] = [];

  segments.push(service.title.value);

  if (options?.sorbet?.includeVersion !== false) {
    segments.push(`v${service.majorVersion.value}`);
  }

  if (subModule) {
    const subModuleSegments =
      typeof subModule === 'string' ? [subModule] : subModule;
    segments.push(...subModuleSegments);
  }

  return segments.map(pascal).join('::');
}

export function buildInterfaceName(int: Interface): string {
  return pascal(`${int.name}_service`);
}
export function buildInterfaceNamespace(
  service: Service,
  options?: NamespacedSorbetOptions,
): string {
  return buildNamespace(options?.sorbet?.interfacesModule, service, options);
}
export function buildInterfaceFilepath(
  int: Interface,
  service: Service,
  options?: NamespacedSorbetOptions,
): string[] {
  const namespace = buildInterfaceNamespace(service, options);

  return [
    ...namespace.split('::').map(snake),
    `${snake(buildInterfaceName(int))}.rb`,
  ];
}

export function buildTypeNamespace(
  service: Service,
  options?: NamespacedSorbetOptions,
): string {
  return buildNamespace(options?.sorbet?.typesModule, service, options);
}
export function buildTypeFilepath(
  type: Type,
  service: Service,
  options?: NamespacedSorbetOptions,
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
  type: TypedValue;
  service: Service;
  options: NamespacedSorbetOptions | undefined;
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
    const union = service.unions.find(
      (u) => u.name.value === type.typeName.value,
    );
    if (union) {
      return `T.any(${union.members
        .map((v) => buildTypeName({ type: v, service, options }))
        .join(', ')})`;
    }

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
  options?: NamespacedSorbetOptions,
): string {
  return buildNamespace(options?.sorbet?.enumsModule, service, options);
}
export function buildEnumFilepath(
  e: Enum,
  service: Service,
  options?: NamespacedSorbetOptions,
): string[] {
  const namespace = buildEnumNamespace(service, options);

  return [...namespace.split('::').map(snake), `${snake(e.name.value)}.rb`];
}

export function buildServiceLocatorName(): string {
  return 'ServiceLocator';
}
export function buildServiceLocatorNamespace(
  service: Service,
  options?: NamespacedSorbetOptions,
): string {
  return buildNamespace('utils', service, options);
}
export function buildServiceLocatorFilepath(
  service: Service,
  options?: NamespacedSorbetOptions,
): string[] {
  const namespace = buildServiceLocatorNamespace(service, options);

  return [
    ...namespace.split('::').map(snake),
    `${snake(buildServiceLocatorName())}.rb`,
  ];
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
