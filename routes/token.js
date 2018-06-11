const jwt = require('jwt-simple');
module.exports = app => {
  const Users = app.db.models.Users;
  const config = app.libs.config;

  app.post('/token', async(req, res)=>{
    const user = await Users.findOne({
      where:{
        email: req.body.email
      }
    });
    if (user){
      if (Users.isPassword(user.password, req.body.password)){
        const payload = {
          id: user.id
        };

        res.json({
          tokem: jwt.encode(payload, config.jwtSecret)
        })
      } else{
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  })
}
