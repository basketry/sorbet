import {
  Enum,
  Interface,
  Method,
  Parameter,
  Property,
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
