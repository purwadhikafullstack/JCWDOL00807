const generateRef = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let referral_code = "";
  for (let i = 0, n = charset.length; i < length; i++) {
    referral_code += charset
      .charAt(Math.floor(Math.random() * n))
      .toUpperCase();
  }
  return referral_code;
};
module.exports = { generateRef };
