module.exports = {
  get: (cookie) => {
    let result = undefined;
    document.cookie.split(';').forEach(biscuit => {
      let tab = biscuit.split('=');
      if (tab[0] !== undefined && tab[0].trim() === cookie) {
        result = tab[1];
      }
    });
    return result;
  },
  set: (name, content) => {
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${content};${expires};path=/`;
  },
  delete: (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  }
};