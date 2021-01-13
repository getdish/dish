import { CompilerOptions, ModuleKind } from 'typescript'

export const typescriptOptions: CompilerOptions = {
  downlevelIteration: true,
  esModuleInterop: true,
  allowJs: false,
  skipLibCheck: true,
  lib: ['lib.esnext.d.ts'],
  skipDefaultLibCheck: true,
}
