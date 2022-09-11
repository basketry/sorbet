import {
  NamespacedBasketryOptions,
  Service,
  warning as buildWarning,
} from 'basketry';
import { comment, from } from './utils';

export const warning = (
  service: Service,
  pkg: {
    name: string;
    version: string;
    homepage?: string;
  },
  options?: NamespacedBasketryOptions,
) => from(comment(buildWarning(service, pkg, options || {})));
