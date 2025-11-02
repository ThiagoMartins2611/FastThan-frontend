declare module "*.css";

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // adicione outras variáveis aqui se quiser
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}