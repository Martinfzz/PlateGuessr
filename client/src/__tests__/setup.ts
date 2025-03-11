import "@testing-library/jest-dom";

global.console = {
  ...global.console,
  error: jest.fn(),
};

global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  root = null;
  rootMargin = "";
  thresholds = [];
  takeRecords() {
    return [];
  }
};

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

require("jest-fetch-mock").enableMocks();

export {};
