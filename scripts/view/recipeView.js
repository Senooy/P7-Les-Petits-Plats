import { recipesToShow } from '../../index.js'
import { ControllerRecipes } from '../controller/recipeController.js'

export class ViewRecipes {
	constructor(controller) {
		this.controller = controller

		this.ingredientButtonList = document.getElementById('ingredientsList')
		this.applianceButtonList = document.getElementById('appliancesList')
		this.ustensilsButtonList = document.getElementById('ustensilsList')

		// J'utilise bind pour pouvoir conserver le this de la classe ViewRecipes dans la méthode displayRecipesList
		this.displayRecipesList = this.displayRecipesList.bind(this)

		this.recipeSnippet = document.getElementById('recipes-zone')
		this.searchInput = document.querySelector('#search-zone')
	}

	// Méthode pour afficher la liste des recettes à l'utilisateur

	displayRecipesList(recipesToShow, ingredientList = [], applianceList = [], ustensilList = []) {
		this.recipeSnippet.innerHTML = ''
		this.ingredientButtonList.innerHTML = ''
		this.applianceButtonList.innerHTML = ''
		this.ustensilsButtonList.innerHTML = ''

		if (recipesToShow) {
			recipesToShow.forEach((recipe) => {
				// Je normalise le nom de la recette pour pouvoir l'utiliser dynamiquement comme nom d'image
				const imageName = recipe.name
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.split(' ')
					.join('-')

				// Je crée une div pour chaque recette et je l'insère dans la div recipes-zone
				this.recipeSnippet.innerHTML += `
        <div id="card-container" class="col-12 col-lg-4">
                    <article class="card h-100 border-0">
                        <img src="./assets/images/${imageName}.webp" alt="photo de ${
					recipe.name
				}" class="card-img-top" height="178px">
                        <div class="card-body rounded-bottom">
                            <div id="recipe-name-time" class="d-flex flex-row justify-content-between">
                                <h5 class="card-title w-75">${recipe.name}</h5>
                                <div class="recipe-time">
                                    <span class="timeIcon me-1">
                                        <img src="./assets/icons/time.svg" alt="icone d'horloge">
                                    </span>
                                    <span id="timeValue">${recipe.time} min</span>
                                </div>
                            </div>
                            <div class="card-text py-3 d-flex flex-row">
                                <ul class="ingredients-list w-50 pl-0">
                                    ${recipe.ingredients
																			.map((ingredient) => {
																				return `<li>${ingredient.ingredient}: ${
																					ingredient.quantity ? ingredient.quantity : ''
																				} ${ingredient.unit ? ingredient.unit : ''}</li>`
																			})
																			.join('')}
                                </ul>
                                <p class="recipe-description w-50">
                                    ${recipe.description}
                                </p>
                            </div>
                        </div>
                    </article>
                </div>        
        `
			})
		}
		this.ingredientButtonList.innerHTML += `
		${ingredientList
			.map((ingredient) => {
				return `<li>${ingredient}</li>`
			})
			.join('')}
		`
		this.applianceButtonList.innerHTML += `
		${applianceList
			.map((appliance) => {
				return `<li>${appliance}</li>`
			})
			.join('')}
		`
		this.ustensilsButtonList.innerHTML += `
		${ustensilList
			.map((ustensil) => {
				return `<li>${ustensil}</li>`
			})
			.join('')}
		`
	}

	// Méthode pour filtrer les recettes par ingrédient
	filterIngredients(search) {
		for (let ingredientElement of this.ingredientButtonList.children) {
			ingredientElement.style.display = 'block'
			if (!ingredientElement.textContent.toLowerCase().includes(search)) {
				ingredientElement.style.display = 'none'
			}
		}
	}

	// Méthode pour filtrer les recettes par appareil
	filterAppliances(search) {
		for (let applianceElement of this.applianceButtonList.children) {
			applianceElement.style.display = 'block'
			if (!applianceElement.textContent.toLowerCase().includes(search)) {
				applianceElement.style.display = 'none'
			}
		}
	}

	// Méthode pour filtrer les recettes par ustensile
	filterUstensils(search) {
		for (let ustensilElement of this.ustensilsButtonList.children) {
			ustensilElement.style.display = 'block'
			if (!ustensilElement.textContent.toLowerCase().includes(search)) {
				ustensilElement.style.display = 'none'
			}
		}
	}

	// Méthode pour écouter l'input de recherche
	// listenSearchInput(callback) {
	// 	this.searchInput.addEventListener('input', (event) => {
	// 		const searchText = event.target.value
	// 		callback(searchText)
	// 	})
	// 	//return this.searchText
	// }
}

export class KeywordsView {
	constructor(controller) {
		this.controller = controller
		this.keywordsToClick = document.querySelectorAll('.accordion-body ul li')
	}

	// Méthode pour écouter les clics sur les mots-clés
	// listenKeywordsClick(callback) {
	// 	this.keywordsToClick.forEach((keyword) => {
	// 		keyword.addEventListener('click', (event) => {
	// 			const keywordContent = event.target.textContent
	// 			callback(keywordContent)
	// 		})
	// 	})
	// }
}

// je crée une classe pour gérer les tags de filtre
export class FilterTagView {
	constructor(controller) {
		this.controller = controller
		this.add = this.add.bind(this)
		this.remove = this.remove.bind(this)
	}

	// Méthode pour ajouter un tag de filtre
	add(type, tag) {
		const filterTagSnippet = document.getElementById('tags-zone')

		filterTagSnippet.innerHTML += `
        <button type="button" class="tag tag-${type}">${tag}
                <img src="./assets/icons/tag-close.svg" alt="icone de fermeture du tag" class="tag-close">
            </button>
        `
	}

	// Méthode pour supprimer un tag de filtre
	remove(event) {
		const tagToDelete = event.target.closest('.tag')
		const tagContent = tagToDelete.textContent
		console.log('tag supprimé :', tagContent)
		// je récupère le contenu du tag pour pouvoir le supprimer du DOM
		tagToDelete.style.display = 'none'
	}
}
