import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Recipe, MealType } from '../types';

interface RecipeDetailProps {
  recipes: Recipe[];
  addScheduledMeal: (recipeId: number, date: Date, mealType: MealType) => void;
}

function RecipeDetail({ recipes, addScheduledMeal }: RecipeDetailProps) {
  const { id } = useParams<{ id: string }>();
  const recipe = recipes.find(r => r.id === parseInt(id || '0'));
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');

  if (!recipe) {
    return (
      <div className="alert alert-danger">
        Recipe not found
      </div>
    );
  }

  const handleScheduleMeal = () => {
    const date = new Date(selectedDate);
    addScheduledMeal(recipe.id, date, selectedMealType);
    setShowScheduleModal(false);
  };

  return (
    <div className="recipe-detail">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/recipes" className="btn btn-sm btn-outline-secondary">
          <span className="d-none d-sm-inline">← Back to Recipes</span>
          <span className="d-sm-none">← Back</span>
        </Link>
        <button 
          className="btn btn-sm btn-primary"
          onClick={() => setShowScheduleModal(true)}
        >
          Schedule Meal
        </button>
      </div>
      
      <h1 className="h3">{recipe.name}</h1>
      <p className="description">{recipe.description}</p>
      
      <div className="ingredients">
        <h2 className="h5">Ingredients</h2>
        <ul className="list-group">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="list-group-item">
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="instructions">
        <h2 className="h5">Instructions</h2>
        <div className="card">
          <div className="card-body">
            <p className="card-text">{recipe.instructions}</p>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowScheduleModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Schedule {recipe.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowScheduleModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="schedule-date" className="form-label">Date</label>
                  <input
                    type="date"
                    id="schedule-date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Meal Type</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="mealType"
                      id="detail-breakfast"
                      value="breakfast"
                      checked={selectedMealType === 'breakfast'}
                      onChange={() => setSelectedMealType('breakfast')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="detail-breakfast">Breakfast</label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="mealType"
                      id="detail-lunch"
                      value="lunch"
                      checked={selectedMealType === 'lunch'}
                      onChange={() => setSelectedMealType('lunch')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="detail-lunch">Lunch</label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="mealType"
                      id="detail-dinner"
                      value="dinner"
                      checked={selectedMealType === 'dinner'}
                      onChange={() => setSelectedMealType('dinner')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="detail-dinner">Dinner</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleScheduleMeal}>Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeDetail; 