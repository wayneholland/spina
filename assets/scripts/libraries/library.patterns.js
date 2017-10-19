
var patterns = {
  password: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})+/,
  email: /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
  zip: /^\d{5}$|^\d{5}-\d{4}$/,
  integers: /^[0-9]+$/,
  phone: /^[0-9]{10}$/,
  letters: /^[a-zA-Z]+$/
};
