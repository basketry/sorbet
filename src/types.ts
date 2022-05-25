export type SorbetOptions = {
  sorbet?: {
    typesModule?: string;
    enumsModule?: string;
    interfacesModule?: string;
    fileIncludes?: string[];
    includeVersion?: boolean;
    types?: Record<string, string>;
  };
};
