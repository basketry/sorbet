export type SorbetOptions = {
  typesModule?: string;
  enumsModule?: string;
  interfacesModule?: string;
  fileIncludes?: string[];
  magicComments?: string[];
  includeVersion?: boolean;
  types?: Record<string, string>;
};

export type NamespacedSorbetOptions = {
  basketry?: {
    subfolder?: string;
  };
  sorbet?: SorbetOptions;
};
