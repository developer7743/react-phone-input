module.exports = async function (config) {
  config.module.rules = config.module.rules.filter(({ use }) => {
    if (!use) return true;
    return !use.find(({ options }) => options && options.eslintPath);
  });

  return config;
};
