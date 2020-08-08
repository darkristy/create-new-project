const waitASecond = async () =>
  new Promise(resolve => setTimeout(resolve, 1000));

module.exports = waitASecond;
