/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<import("../env").Api> {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
