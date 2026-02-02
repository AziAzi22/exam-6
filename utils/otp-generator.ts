export const otpGenerator = () => {
  const generatedCode = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  return generatedCode;
};