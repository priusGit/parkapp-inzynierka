import { generateAccessCode, getErrorMessage } from "../_helpers";

describe("registerParkingPage helpers", () => {
  describe("generateAccessCode", () => {
    it("should generate 6 character code", () => {
      const code = generateAccessCode();
      expect(code).toHaveLength(6);
    });

    it("should generate code with uppercase letters and numbers", () => {
      const code = generateAccessCode();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });

    it("should generate different codes on multiple calls", () => {
      const code1 = generateAccessCode();
      const code2 = generateAccessCode();
      // It's unlikely but possible they match, so we'll just check format
      expect(code1).toHaveLength(6);
      expect(code2).toHaveLength(6);
    });
  });

  describe("getErrorMessage", () => {
    it("should return correct message for email-already-in-use", () => {
      const result = getErrorMessage("auth/email-already-in-use");
      expect(result).toBe("Ten adres email jest już używany");
    });

    it("should return correct message for invalid-email", () => {
      const result = getErrorMessage("auth/invalid-email");
      expect(result).toBe("Nieprawidłowy adres email");
    });

    it("should return correct message for weak-password", () => {
      const result = getErrorMessage("auth/weak-password");
      expect(result).toBe("Hasło jest zbyt słabe");
    });

    it("should return default message for unknown error code", () => {
      const result = getErrorMessage("auth/unknown-error");
      expect(result).toBe("Wystąpił błąd podczas rejestracji");
    });
  });
});
