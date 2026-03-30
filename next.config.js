module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Hire-Me',    value: 'eneekoruiz@gmail.com' },
      { key: 'X-Powered-By', value: 'Clean Architecture'   },
    ] }];
  },
};
