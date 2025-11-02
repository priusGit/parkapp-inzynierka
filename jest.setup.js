import { jest } from "@jest/globals";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
}));

jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
    doc: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    getDoc: jest.fn(() => ({
      exists: () => true,
      data: () => ({ name: "Mock Parking", address: "Mock Address" }),
    })),
    getDocs: jest.fn(() => ({
      docs: [
        {
          id: "1",
          data: () => ({ name: "Test Parking", address: "Mock Address" }),
        },
      ],
    })),
    query: jest.fn((...args) => args),
    where: jest.fn((field, op, value) => ({ field, op, value })),
    orderBy: jest.fn((field, dir) => ({ field, dir })),
    onSnapshot: jest.fn((q, callback) => {
      const fakeSnapshot = {
        docs: [
          { id: "1", data: () => ({ name: "Test Reservation" }) },
          { id: "2", data: () => ({ name: "Another Reservation" }) },
        ],
      };
      callback(fakeSnapshot);
      return jest.fn();
    }),
    serverTimestamp: jest.fn(() => "timestamp"),
  };
});

jest.mock("@react-navigation/bottom-tabs", () => {
  const actual = jest.requireActual("@react-navigation/bottom-tabs");
  return {
    ...actual,
    useBottomTabBarHeight: () => 0,
  };
});
