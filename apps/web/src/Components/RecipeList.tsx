import { Link } from 'react-router-dom';
import { Recipe } from '../types';

interface RecipeListProps {
  recipes: Recipe[];
}

function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="recipe-list">
      <div className="header">
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="btn btn-sm btn-outline-secondary">
            <span className="d-none d-sm-inline">← Back to Calendar</span>
            <span className="d-sm-none">← Calendar</span>
          </Link>
          <h1 className="h4 mb-0">My Recipes</h1>
        </div>
        <Link to="/recipes/create" className="btn btn-sm btn-primary">
          <span className="d-none d-sm-inline">Create New Recipe</span>
          <span className="d-sm-none">+ New</span>
        </Link>
      </div>
      <div className="recipes-container">
        {recipes.map(recipe => (
          <Link 
            to={`/recipes/${recipe.id}`} 
            key={recipe.id} 
            className="text-decoration-none"
          >
            <div className="recipe-card">
              <h2 className="h5">{recipe.name}</h2>
              <p className="description text-truncate">{recipe.description}</p>
              <div className="d-flex align-items-center">
                <small className="text-muted">
                  {recipe.ingredients.length} ingredients
                </small>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecipeList; 