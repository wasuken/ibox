import type { Config } from 'jest';
global.XMLHttpRequest = require('w3c-xmlhttprequest').XMLHttpRequest;
const fetchPolyfill = require('whatwg-fetch');
const XMLHttpRequstPolyfill = require('w3c-xmlhttprequest');

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  verbose: true,
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    fetch: fetchPolyfill.fetch,
    XMLHttpRequest: XMLHttpRequstPolyfill.XMLHttpRequest,
  },
};

export default config;
