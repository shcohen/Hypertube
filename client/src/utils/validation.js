module.exports = {
  login: (formData) => {
    const {login, password} = formData;
    return login && login.length && password && password.length >= 8;
  },
  signin: (formData) => {

  }
};