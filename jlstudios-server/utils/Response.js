const respose = {
  ok: (data) => {
    return {
      code: 200,
      msg: "ok",
      data: data,
    };
  },

  error: (code, errmsg) => {
    return {
      code: code,
      msg: errmsg,
    };
  },
};

module.exports = respose;
