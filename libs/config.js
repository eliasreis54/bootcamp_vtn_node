module.exports = {
  database: 'bootcamp',
  username: '',
  password: '',
  params: {
    dialect: 'sqlite',
    storage: 'bootcamp.sqlite',
    define: {
      underscored: true
    }
  },
  jwtSecret: '8OO7C@MP-AP_1',
  jwtSession: {
    session: false
  }
};
