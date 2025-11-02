export const generateAccessCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Ten adres email jest już używany";
    case "auth/invalid-email":
      return "Nieprawidłowy adres email";
    case "auth/weak-password":
      return "Hasło jest zbyt słabe";
    default:
      return "Wystąpił błąd podczas rejestracji";
  }
};


