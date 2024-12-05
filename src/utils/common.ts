interface HttpRequest {
  hostname: string;
  protocol: string;
}

const checkPasswordStrength = (password: string) => {
  return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
    ? true
    : false;
};
const randomCode = (length: number) => {
  let result = "";
  let characters = "0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export { checkPasswordStrength, randomCode };
