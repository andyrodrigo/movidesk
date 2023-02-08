interface Config {
  [key: string]: string;
}

// Session auth needs to use the same origin anyway
export const config: Config = {
  apiUrl: 'http://localhost:5000',
};
