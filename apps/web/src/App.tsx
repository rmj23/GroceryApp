import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import RecipeList from './Components/RecipeList';
import RecipeDetail from './Components/RecipeDetail';
import CreateRecipe from './Components/CreateRecipe';
import CalendarBigCalendar from './Components/CalendarBigCalendar';
import { Recipe, ScheduledMeal } from './types';

// Initial sample data for our recipes
const initialRecipes: Recipe[] = [
  { 
    id: 1, 
    name: 'Spaghetti Carbonara', 
    description: 'Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper',
    ingredients: ['Spaghetti', 'Eggs', 'Parmesan', 'Pancetta', 'Black Pepper'],
    instructions: '1. Cook pasta\n2. Fry pancetta\n3. Mix eggs and cheese\n4. Combine all ingredients'
  },
  { 
    id: 2, 
    name: 'Chicken Curry', 
    description: 'Spicy Indian curry with tender chicken pieces',
    ingredients: ['Chicken', 'Curry Powder', 'Coconut Milk', 'Onions', 'Garlic'],
    instructions: '1. Marinate chicken\n2. Cook onions and garlic\n3. Add spices\n4. Simmer with coconut milk'
  },
  { 
    id: 3, 
    name: 'Chocolate Cake', 
    description: 'Rich and moist chocolate cake',
    ingredients: ['Flour', 'Cocoa Powder', 'Sugar', 'Eggs', 'Butter'],
    instructions: '1. Mix dry ingredients\n2. Cream butter and sugar\n3. Add eggs\n4. Bake at 350°F'
  }
];

function AppContent() {
  const location = useLocation();
  const isCalendarRoute = location.pathname === '/';
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [scheduledMeals, setScheduledMeals] = useState<ScheduledMeal[]>([]);

  const addRecipe = (newRecipe: Omit<Recipe, 'id'>) => {
    const recipeWithId: Recipe = {
      ...newRecipe,
      id: recipes.length + 1
    };
    setRecipes([...recipes, recipeWithId]);
  };

  const addScheduledMeal = (recipeId: number, date: Date, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const newScheduledMeal: ScheduledMeal = {
      id: scheduledMeals.length + 1,
      recipeId,
      date,
      mealType
    };
    setScheduledMeals([...scheduledMeals, newScheduledMeal]);
  };

  const removeScheduledMeal = (id: number) => {
    setScheduledMeals(scheduledMeals.filter(meal => meal.id !== id));
  };

  return (
    <div className={`app ${isCalendarRoute ? 'app-calendar-full' : ''}`}>
      <Routes>
        <Route 
          path="/" 
          element={
            <CalendarBigCalendar 
              recipes={recipes} 
              scheduledMeals={scheduledMeals} 
              addScheduledMeal={addScheduledMeal}
              removeScheduledMeal={removeScheduledMeal}
            /> 
          } 
        />
        <Route path="/recipes" element={<RecipeList recipes={recipes} />} />
        <Route path="/recipes/create" element={<CreateRecipe addRecipe={addRecipe} />} />
        <Route 
          path="/recipes/:id" 
          element={
            <RecipeDetail 
              recipes={recipes} 
              addScheduledMeal={addScheduledMeal}
            /> 
          } 
        />
      </Routes>
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
