const Recipe = require('../models/recipe');

exports.createRecipe = (req, res, next) => {
  const recipe = new Recipe ({    
    title: req.body.title,                                 
    ingredients:req.body.ingredients,
    instructions: req.body.instructions,
    time:req.body.time,
    difficulty: req.body.difficulty,
    _id: req.body._id
  });
  recipe.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch( 
    (error) => {
      res.status(400).json({
        error:error
      });
    }
  )
  };

  exports.getOneRecipe = (req, res, next) => {
    Recipe.findOne({
      _id: req.params.id
    }).then(
      (recipe) => {
        res.status(200).json(recipe);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

  exports.modifyRecipe = (req, res, next) => {
    const recipe = new Recipe({
      _id: req.params.id,
      title: req.body.title,
      ingredients:req.body.ingredients,
      instructions: req.body.instructions,
      id: req.body.id,
      time:req.body.time,
      difficulty: req.body.difficulty
    });
    Recipe.updateOne({_id: req.params.id}, recipe).then(
      () => {
        res.status(201).json({
          message: 'Recipe updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  exports.deleteRecipe = (req, res, next) => {
    Recipe.deleteOne({_id: req.params.id}).then(
      () => {
        res.status(200).json({
          message: 
          'Recipe deleted successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  }; 

  exports.getAllRecipe = (req, res, next) => {
    Recipe.find().then(
      (recipes) => {
        res.status(200).json(recipe);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };