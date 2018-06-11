const { body, param, validationResult }  = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
module.exports = app =>{
  const Tasks = app.db.models.Tasks;
  app.route('/tasks')
    .all(app.auth.authenticate())
    .get(async (req, res)=>{
      try{
        const tasks = await Tasks.findAll({
          where: {
            user_id: req.body.id
          }
        });
        res.json(tasks);
      } catch (erro) {
        console.log(erro);
        res.status(500).json({msg: 'Unexpected error'})
      }
    })

    .post([
      body('title', 'Required field').exists(),
      body('title', 'Invalid Length').trim().isLength({ min: 1, max: 255 })
    ], async (req, res)=>{
      try{
        const erros = validationResult(req);
        if (!erros.isEmpty()){
          return res.status(400).json({errors: erros.array()})
        }
        let task = matchedData(req);
        task.user_id = req.user.id;

        const taskReturn = await Tasks.create(task);
        res.json(taskReturn);
      } catch (erro) {
        console.log(erro);
        res.status(500).json({msg: 'Unexpected error'})
      }
    });

  app.route('/tasks/:id')
    .all(app.auth.authenticate())
    .get([
      param('id','Not an integer').isInt()
    ],async (req, res)=>{
      try{
        const erros = validationResult(req);
        if (!erros.isEmpty()){
          return res.status(400).json({errors: erros.array()})
        }
        const task = await Tasks.findByOne({
          where: {
            id: req.param.user_id,
            user_id: req.user.id
          }
        });
        if (task){
          res.json(task)
        } else{
          res.sendStatus(404);
        }

      } catch (erro) {
        console.log(erro);
        res.status(500).json({msg: 'Unexpected error'})
      }
    })

    .put([
      param('id','Not an integer').isInt(),
      body('title', 'Required field').exists(),
      body('title', 'Invalid Length').trim().isLength({ min: 1, max: 255 }),
      body('done', 'Required field').exists(),
      body('done', 'Not a bollean').isBoolean()
    ], async  (req, res)=>{
      try{
        const erros = validationResult(req);
        if (!erros.isEmpty()){
          return res.status(400).json({errors: erros.array()})
        }
        await Tasks.update(matchedData(req), {
          where: {
            id: req.params.id,
            user_id: req.user.id
          }
        })
        res.sendStatus(204);
      } catch (erro) {
        console.log(erro);
        res.status(500).json({msg: 'Unexpected error'})
      }
    })

    .delete([
      param('id','Not an integer').isInt()
    ],async (req, res)=>{
      try{
        await Tasks.destroy({
          where:{
            id: req.params.id,
            user_id: req.user.id
          }
        });
        res.sendStatus(204);
      } catch (erro) {
        console.log(erro);
        res.status(500).json({msg: 'Unexpected error'})
      }
    });
}
