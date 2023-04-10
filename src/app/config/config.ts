interface Config {
  [key: string]: string;
}

// Session auth needs to use the same origin anyway
export const config: Config = {
  apiUrl: 'http://apimd.topdownrn.com.br',
};
