module.exports = {
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    name: "index",
    params: {},
  }),
  ThemeProvider: ({ children }) => children,
  DefaultTheme: {},
  DarkTheme: {},
};
