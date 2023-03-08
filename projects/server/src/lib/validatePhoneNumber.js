function validatePhoneNumber(input_str) {
  var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  return re.test(input_str);
}

// this function will allow phone numbers entered in the formats like this
//1. (123) 456-7890
//2. (123)456-7890
//3. 123-456-780
//4. 1234567890
module.exports = { validatePhoneNumber };
