module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?@?react-native|@react-navigation|expo(nent)?|@expo(nent)?|@expo-google-fonts|react-clone-referenced-element|@unimodules|unimodules|@react-native-community|@react-native)",
  ],
};
