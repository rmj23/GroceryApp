import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateRecipeProps {
  addRecipe: (recipe: { name: string; description: string; ingredients: string[]; instructions: string }) => void;
}

function CreateRecipe({ addRecipe }: CreateRecipeProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArray = ingredients.split('\n').filter(ingredient => ingredient.trim() !== '');
    
    addRecipe({
      name,
      description,
      ingredients: ingredientsArray,
      instructions
    });
    
    navigate('/recipes');
  };

  return (
    <div className="create-recipe">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">Create New Recipe</h1>
        <button 
          onClick={() => navigate('/recipes')} 
          className="btn btn-sm btn-outline-secondary"
        >
          <span className="d-none d-sm-inline">Cancel</span>
          <span className="d-sm-none">←</span>
        </button>
      </div>

      <div className="recipe-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Recipe Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients (one per line)</label>
            <textarea
              className="form-control"
              id="ingredients"
              rows={4}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions</label>
            <textarea
              className="form-control"
              id="instructions"
              rows={6}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRecipe; 