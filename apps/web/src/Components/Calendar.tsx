import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Recipe, ScheduledMeal, MealType } from '../types';

interface CalendarProps {
  recipes: Recipe[];
  scheduledMeals: ScheduledMeal[];
  addScheduledMeal: (recipeId: number, date: Date, mealType: MealType) => void;
  removeScheduledMeal: (id: number) => void;
}

function Calendar({ recipes, scheduledMeals, addScheduledMeal, removeScheduledMeal }: CalendarProps) {
  const [view, setView] = useState<'month' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number>(recipes[0]?.id || 0);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(selectedDate);
    const monthName = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const dayElements = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      dayElements.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const dayMeals = scheduledMeals.filter(meal => 
        meal.date.getDate() === day && 
        meal.date.getMonth() === selectedDate.getMonth() &&
        meal.date.getFullYear() === selectedDate.getFullYear()
      );

      dayElements.push(
        <div 
          key={day} 
          className={`calendar-day ${dayMeals.length ? 'has-recipes' : ''}`}
          onClick={() => {
            setSelectedDate(currentDate);
            setView('day');
          }}
        >
          <div className="day-number">{day}</div>
          {dayMeals.length > 0 ? (
            <div className="recipe-count">{dayMeals.length} meal(s)</div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="calendar-month">
        <div className="calendar-header">
          <h2 className="h4 mb-0">{monthName}</h2>
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}>
              <span className="d-none d-sm-inline">Previous</span>
              <span className="d-sm-none">←</span>
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}>
              <span className="d-none d-sm-inline">Next</span>
              <span className="d-sm-none">→</span>
            </button>
          </div>
        </div>
        <div className="calendar-grid">
          <div className="calendar-weekday">S</div>
          <div className="calendar-weekday">M</div>
          <div className="calendar-weekday">T</div>
          <div className="calendar-weekday">W</div>
          <div className="calendar-weekday">T</div>
          <div className="calendar-weekday">F</div>
          <div className="calendar-weekday">S</div>
          {dayElements}
        </div>
      </div>
    );
  };

  const getMealsForDate = (date: Date) => {
    return scheduledMeals.filter(meal => 
      meal.date.getDate() === date.getDate() && 
      meal.date.getMonth() === date.getMonth() &&
      meal.date.getFullYear() === date.getFullYear()
    );
  };

  const handleAddMeal = () => {
    if (selectedRecipeId) {
      addScheduledMeal(selectedRecipeId, selectedDate, selectedMealType);
      setShowAddMealModal(false);
    }
  };

  const renderDayView = () => {
    const dayMeals = getMealsForDate(selectedDate);
    const mealsByType = {
      breakfast: dayMeals.filter(m => m.mealType === 'breakfast'),
      lunch: dayMeals.filter(m => m.mealType === 'lunch'),
      dinner: dayMeals.filter(m => m.mealType === 'dinner')
    };

    const renderMealSection = (type: MealType, label: string) => {
      const meals = mealsByType[type];
      return (
        <div className="mb-4">
          <h3 className="h5 mb-2">{label}</h3>
          {meals.length > 0 ? (
            <div className="list-group">
              {meals.map(meal => {
                const recipe = recipes.find(r => r.id === meal.recipeId);
                return recipe ? (
                  <div key={meal.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{recipe.name}</span>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeScheduledMeal(meal.id)}
                    >
                      Remove
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="text-muted">No {label.toLowerCase()} planned</div>
          )}
        </div>
      );
    };

    return (
      <div className="day-view">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">{selectedDate.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
          <div className="btn-group">
            <button 
              className="btn btn-sm btn-primary" 
              onClick={() => {
                if (recipes.length > 0) {
                  setSelectedRecipeId(recipes[0].id);
                }
                setShowAddMealModal(true);
              }}
            >
              Add Meal
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setView('month')}>
              <span className="d-none d-sm-inline">Back to Calendar</span>
              <span className="d-sm-none">←</span>
            </button>
          </div>
        </div>
        
        {renderMealSection('breakfast', 'Breakfast')}
        {renderMealSection('lunch', 'Lunch')}
        {renderMealSection('dinner', 'Dinner')}

        {dayMeals.length === 0 && (
          <div className="alert alert-info">
            No meals planned for this day. Click "Add Meal" to schedule a recipe.
          </div>
        )}

        {showAddMealModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAddMealModal(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Meal to {selectedDate.toLocaleDateString()}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddMealModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="recipe-select" className="form-label">Recipe</label>
                    <select
                      id="recipe-select"
                      className="form-select"
                      value={selectedRecipeId}
                      onChange={(e) => setSelectedRecipeId(Number(e.target.value))}
                    >
                      {recipes.map(recipe => (
                        <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Meal Type</label>
                    <div className="btn-group w-100" role="group">
                      <input
                        type="radio"
                        className="btn-check"
                        name="mealType"
                        id="breakfast"
                        value="breakfast"
                        checked={selectedMealType === 'breakfast'}
                        onChange={() => setSelectedMealType('breakfast')}
                      />
                      <label className="btn btn-outline-primary" htmlFor="breakfast">Breakfast</label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="mealType"
                        id="lunch"
                        value="lunch"
                        checked={selectedMealType === 'lunch'}
                        onChange={() => setSelectedMealType('lunch')}
                      />
                      <label className="btn btn-outline-primary" htmlFor="lunch">Lunch</label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="mealType"
                        id="dinner"
                        value="dinner"
                        checked={selectedMealType === 'dinner'}
                        onChange={() => setSelectedMealType('dinner')}
                      />
                      <label className="btn btn-outline-primary" htmlFor="dinner">Dinner</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddMealModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleAddMeal}>Add Meal</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">Meal Planner</h1>
        {view === 'month' && (
          <Link to="/recipes" className="btn btn-sm btn-primary">
            <span className="d-none d-sm-inline">View All Recipes</span>
            <span className="d-sm-none">Recipes</span>
          </Link>
        )}
      </div>
      {view === 'month' ? renderMonthView() : renderDayView()}
    </div>
  );
}

export default Calendar; 