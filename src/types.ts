export type SorbetOptions = {
  typesModule?: string | string[];
  enumsModule?: string | string[];
  interfacesModule?: string | string[];
  fileIncludes?: string[];
  magicComments?: string[];
  includeVersion?: boolean;
  types?: Record<string, string>;
};

export type BasketryOptions = {
  subfolder?: string;
  exclude?: string[];
};

export type NamespacedSorbetOptions = {
  basketry?: BasketryOptions;
  sorbet?: SorbetOptions;
};
