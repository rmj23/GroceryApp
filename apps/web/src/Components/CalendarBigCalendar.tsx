import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Event, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Recipe, ScheduledMeal, MealType } from '../types';

const locales = {
  'en-US': enUS,
};

// Custom format function to remove leading zeros from dates
const customFormat = (date: Date, formatStr: string, options?: any) => {
  // For 'dd' format (day with leading zeros), return without zeros
  if (formatStr === 'dd') {
    return date.getDate().toString();
  }
  // For all other formats, use date-fns
  return format(date, formatStr, options);
};

const localizer = dateFnsLocalizer({
  format: customFormat,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarBigCalendarProps {
  recipes: Recipe[];
  scheduledMeals: ScheduledMeal[];
  addScheduledMeal: (recipeId: number, date: Date, mealType: MealType) => void;
  removeScheduledMeal: (id: number) => void;
}

interface DateCellWrapperProps {
  value: Date;
  children: React.ReactNode;
}

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
}

interface DateCellEvent {
  value: Date;
}

// Custom date cell component to display day numbers without leading zeros
const CustomDateCell = ({ value }: DateCellEvent) => {
  const day = value.getDate();
  return <span className="fw-medium text-center d-block">{day}</span>;
};

function CalendarBigCalendar({ 
  recipes, 
  scheduledMeals, 
  addScheduledMeal, 
  removeScheduledMeal 
}: CalendarBigCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number>(recipes[0]?.id || 0);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');

  // Convert ScheduledMeal[] to Event[] format for react-big-calendar
  const events: Event[] = useMemo(() => {
    return scheduledMeals.map(meal => {
      const recipe = recipes.find(r => r.id === meal.recipeId);
      return {
        id: meal.id,
        title: recipe?.name || 'Unknown Recipe',
        start: meal.date,
        end: meal.date,
        resource: {
          mealType: meal.mealType,
          recipeId: meal.recipeId,
        },
      };
    });
  }, [scheduledMeals, recipes]);

  // Get meals for a specific date grouped by meal type
  const getMealsForDate = (date: Date): ScheduledMeal[] => {
    return scheduledMeals.filter(meal => {
      const mealDate = meal.date;
      return (
        mealDate.getDate() === date.getDate() &&
        mealDate.getMonth() === date.getMonth() &&
        mealDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Custom toolbar component
  const CustomToolbar = ({ label, onNavigate }: CustomToolbarProps) => {
    return (
      <div className="rbc-toolbar rbc-toolbar-modern d-flex justify-content-between align-items-center mb-4 pb-3">
        <div className="toolbar-label-container">
          <h2 className="toolbar-month-year mb-0 fw-normal">{label}</h2>
        </div>
        <div className="toolbar-nav-buttons d-flex gap-2">
          <button
            type="button"
            onClick={() => onNavigate('PREV')}
            className="toolbar-nav-btn toolbar-prev-btn"
            aria-label="Previous month"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onNavigate('NEXT')}
            className="toolbar-nav-btn toolbar-next-btn"
            aria-label="Next month"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Custom date cell wrapper to display meal type badges
  const DateCellWrapper = ({ value, children }: DateCellWrapperProps) => {
    const dayMeals = getMealsForDate(value);
    const hasMeals = dayMeals.length > 0;
    
    // Group meals by type and count them
    const mealCounts = dayMeals.reduce((acc, meal) => {
      acc[meal.mealType] = (acc[meal.mealType] || 0) + 1;
      return acc;
    }, {} as Record<MealType, number>);
    
    return (
      <div className={`rbc-date-cell-wrapper position-relative h-100 w-100 d-flex flex-column ${hasMeals ? 'rbc-day-has-meals' : ''}`}>
        <div className="flex-grow-1">{children}</div>
        {hasMeals && (
          <div className="meal-badges-container position-absolute bottom-0 start-0 end-0 p-1 d-flex flex-wrap gap-1 justify-content-center">
            {Object.entries(mealCounts).map(([mealType, count], index) => (
              <span 
                key={mealType} 
                className={`meal-badge meal-badge-${mealType} badge-fade-in`}
                title={`${count} ${mealType}${count > 1 ? 's' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {mealType.charAt(0).toUpperCase()}
                {count > 1 && <span className="meal-badge-count">{count}</span>}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Handle day click to add meal
  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    if (recipes.length > 0) {
      setSelectedRecipeId(recipes[0].id);
    }
    setShowAddMealModal(true);
  };

  // Handle adding meal
  const handleAddMeal = () => {
    if (selectedRecipeId) {
      addScheduledMeal(selectedRecipeId, selectedDate, selectedMealType);
      setShowAddMealModal(false);
    }
  };

  // Handle navigation
  const handleNavigate = (newDate: Date, view: View) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="calendar-container-modern">
      <div className="calendar-header-modern d-flex justify-content-between align-items-center mb-4">
        <h1 className="calendar-title h3 mb-0 fw-semibold">Meal Planner</h1>
        <Link to="/recipes" className="btn btn-primary btn-sm">
          <span className="d-none d-sm-inline">View All Recipes</span>
          <span className="d-sm-none">Recipes</span>
        </Link>
      </div>
      
      <div className="calendar-big-wrapper-modern">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={['month']}
          selectable
          onSelectSlot={handleSelectSlot}
          onNavigate={handleNavigate}
          date={selectedDate}
          components={{
            toolbar: CustomToolbar,
            dateCellWrapper: DateCellWrapper,
            dateCell: CustomDateCell,
          }}
          className="calendar-modern"
        />
      </div>

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <div 
          className="modal show d-block modal-backdrop-modern position-fixed top-0 start-0 end-0 bottom-0 modal-fade-in" 
          style={{ zIndex: 1050 }}
          onClick={() => setShowAddMealModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content modal-content-modern shadow-lg">
              <div className="modal-header modal-header-modern border-bottom">
                <h5 className="modal-title fw-semibold">Add Meal to {selectedDate.toLocaleDateString()}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddMealModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body modal-body-modern">
                <div className="mb-4">
                  <label htmlFor="recipe-select" className="form-label fw-medium">Recipe</label>
                  <select
                    id="recipe-select"
                    className="form-select form-select-modern"
                    value={selectedRecipeId}
                    onChange={(e) => setSelectedRecipeId(Number(e.target.value))}
                  >
                    {recipes.map(recipe => (
                      <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium mb-2">Meal Type</label>
                  <div className="btn-group w-100 meal-type-selector" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="mealType"
                      id="breakfast-big"
                      value="breakfast"
                      checked={selectedMealType === 'breakfast'}
                      onChange={() => setSelectedMealType('breakfast')}
                    />
                    <label className="btn btn-outline-primary meal-type-btn" htmlFor="breakfast-big">Breakfast</label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="mealType"
                      id="lunch-big"
                      value="lunch"
                      checked={selectedMealType === 'lunch'}
                      onChange={() => setSelectedMealType('lunch')}
                    />
                    <label className="btn btn-outline-primary meal-type-btn" htmlFor="lunch-big">Lunch</label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="mealType"
                      id="dinner-big"
                      value="dinner"
                      checked={selectedMealType === 'dinner'}
                      onChange={() => setSelectedMealType('dinner')}
                    />
                    <label className="btn btn-outline-primary meal-type-btn" htmlFor="dinner-big">Dinner</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer modal-footer-modern border-top">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setShowAddMealModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm" 
                  onClick={handleAddMeal}
                >
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarBigCalendar;

