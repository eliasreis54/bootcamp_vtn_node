const passport = require('passport');
const { Strategy, ExtractJwt} = require('passport-jwt');
module.exports = app => {
  const Users = app.db.models.Users;
  const config = app.libs.config;

  const params = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
  };

  const strategy = new Strategy(params,
    async(payload, done)=>{
    try{
      const user = await Users.findById(payload.id)
      if (user){
        return done(null,
          {
            id: user.id,
            email: user.email
          }
        )
      } else {
        return done(null, false);
      }
    }catch(err){
      return done(err, null);
    }
  });
  passport.use(strategy);
  return{
    initialize: () =>{
      return passport.initialize();
    },
    authenticate: () =>{
      return passport.authenticate('jwt', config.jwtSession);
    }
  }
}
