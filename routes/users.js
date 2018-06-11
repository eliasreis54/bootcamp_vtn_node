const { body, param, validationResult }  = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

module.exports = app => {
  const Users = app.db.models.Users;

  app.post('/users',[
    body('name', 'Required field').exists(),
    body('name', 'Invalid length').trim().isLength({min:1, max:255}),
    body('email','Required Field').exists(),
    body('email','Invalid email').isEmail(),
    body('password', 'Required field').exists(),
    body('password', 'Invalid length').trim().isLength({min:8, max:12}),
  ], async (req, res) =>{
    try {
      const erros = validationResult(req);
      if (!erros.isEmpty()){
        return res.status(400).json({errors: erros.array()})
      }
      const existingUser = await Users.findOne({
        where: {
          email: req.body.email
        }
      });
      if (existingUser){
        return res.status(409).json({msg: 'email already exist'});
      }
      let user = await Users.create(matchedData(req));
      user = await Users.findById(user.id,{
        attributes: ['id', 'name', 'email', 'created_at', 'updated_at']
      });

      res.json(user);
    } catch (err) {
      console.log(erro);
      res.status(500).json({msg: 'Unexpected error'})
    }
  });
}
