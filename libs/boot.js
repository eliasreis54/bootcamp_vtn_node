module.exports = app  => {
  app.db.sequelize.sync().done(() =>{
    app.listen(app.get('port'), ()=>{
      console.log(`Bootcamp API - port ${app.get('port')}`);
    });
  });
};
