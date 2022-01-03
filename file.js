const meals = document.getElementById('meals');
const fav_container = document.getElementById('fav-meals');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
const mealPopup = document.getElementById('meal-popup');
const popupCloseBtn = document.getElementById('close-popup');
const mealInfo = document.getElementById('meal-info');
getRandomMeal();
fetchFavMeals();
async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    console.log(randomMeal);
    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const respData = await resp.json();
    const meal = await respData.meals[0];
    return meal;
}
async function getMealsBySearch(term) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
    const respData = await resp.json();
    
    return respData.meals;
}







function addMeal(mealData, random = false) {
    console.log(mealData);
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `
    <div class="meal-header">
    ${random ? `<span class="random">Random Recipe</span>`:``}
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn"><i class="fa fa-heart"></i></button>
        </div>
</div>`;
meals.appendChild(meal);
    meal.querySelector('.meal-body .fav-btn').addEventListener('click', (e) => {
        if (e.target.classList.contains('active')) {
            e.target.classList.remove('active');
            removeMealFromLS(mealData.idMeal);
        } else {
            e.target.classList.add('active');
            addMealToLS(mealData.idMeal);
        }
        fav_container.innerHTML = '';
        fetchFavMeals();
})
meal.addEventListener('click', () => {
    showMealData(mealData);
})
  meal.addEventListener('click', () => {
      showMealData(mealData);
  })  
} 



















function addMealToLS(mealId) {
    const mealIds = getMealFromLS();
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealFromLS(mealId) {
    const mealIds = getMealFromLS();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id!== mealId)));
}
function getMealFromLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    return mealIds === null ? [] : mealIds;
    
}
async function fetchFavMeals() {
    fav_container.innerHTML = "";//clean the container
    const mealIds = getMealFromLS();
    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);
        addMealFav(meal);
    }
   
    
}
function addMealFav(mealData) {
    
    const favMeal = document.createElement("li");
	
    favMeal.innerHTML = `<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span><button class="clear"><i class= "fas fa-window-close"></i></button>`;
    const btn = favMeal.querySelector('.clear');
    btn.addEventListener('click', () => {
        removeMealFromLS(mealData.idMeal);
        fetchFavMeals();
    })
	favMeal.addEventListener('click', () => {
		showMealData(mealData);
	})
    fav_container.appendChild(favMeal);
    
}
function showMealData(mealData) {
    mealInfo.innerHTML = "";
    const mealEl = document.createElement('div');
	const ings = [];
	for (let i = 0; i <= 20; i++) {
		if(mealData['strIngredient' + i]) {
			ings.push(`${mealData['strIngredient' + i]} / ${mealData['strMeasure' + i]}`);
			console.log(ings);
		} else {
			continue;
		}
	}
    mealEl.innerHTML = `
<h1>${mealData.strMeal}</h1>
                
                <img src="${mealData.strMealThumb}" alt=""/>
            
            
                <p>${mealData.strInstructions}</p>
<h3>ingrediants</h3>
                <ul>
${ings.map(ing => `<li>${ing}</li>`).join("")}
</ul>
`;
    mealInfo.appendChild(mealEl);
    
    mealPopup.classList.remove('hidden');
}

searchBtn.addEventListener('click', async () => {
    meals.innerHTML = "";
    const search = searchTerm.value;
    const mealEl= await getMealsBySearch(search);
    console.log(meals);
    if (meals) {
        mealEl.forEach(meal => {
        addMeal(meal, true);
    })
    }
})
popupCloseBtn.addEventListener('click', () => {
    mealPopup.classList.add("hidden");
})


























