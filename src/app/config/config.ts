interface Config {
  [key: string]: string;
}

// Session auth needs to use the same origin anyway
export const config: Config = {
  apiUrl: 'https://apimd.topdownrn.com.br',
  page: 'https://andyrodrigo.github.io/movidesk',
};
