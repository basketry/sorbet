import {
  NamespacedBasketryOptions,
  Service,
  warning as buildWarning,
} from 'basketry';

export const warning = (
  service: Service,
  pkg: {
    name: string;
    version: string;
    homepage?: string;
  },
  options?: NamespacedBasketryOptions,
) =>
  Array.from(buildWarning(service, pkg, options || {}))
    .map((x) => `# ${x}`.trim())
    .join('\n');
