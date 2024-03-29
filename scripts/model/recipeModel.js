export class Recipes {
	constructor(recipeList = []) {
		this.mainSearch = ''
		this.recipeList = recipeList

		// Je crée un tableau qui va contenir les tags sélectionnés par l'utilisateur
		this.selectedTags = []

		this.addTag = this.addTag.bind(this)
		this.removeTag = this.removeTag.bind(this)

		this.mainFilteredRecipes = []
		this.resetFilteredRecipes = []
		this.filteredRecipes = []
	}

	// Méthode de suppression des accents //
	removeAccents(str) {
		return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
	}

	// Code des méthodes d'envoi des données liées aux mots-clés à afficher //

	getIngredientList() {
		// Je crée une liste d'ingrédients en utilisant la méthode map pour récupérer les ingrédients de chaque recette et flat pour applatir le tableau
		const ingredients = this.getRecipesFilteredBySearch()
			.map((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient))
			.flat()
		// Je crée un nouveau tableau à partir du tableau d'ingrédients en utilisant la méthode Set pour supprimer les doublons
		return Array.from(new Set(ingredients))
	}

	getApplianceList() {
		// Je crée un tableau d'appareils à partir du tableau de recettes en utilisant la méthode map pour récupérer l'appareil de chaque recette
		const appliances = this.getRecipesFilteredBySearch().map((recipe) => recipe.appliance)
		return Array.from(new Set(appliances))
	}

	getUstensilList() {
		// Je crée une liste d'ustensiles en utilisant la méthode map pour récupérer les ustensiles de chaque recette et flat pour applatir le tableau
		const ustensils = this.getRecipesFilteredBySearch()
			.map((recipe) => recipe.ustensils)
			.flat()
		return Array.from(new Set(ustensils))
	}

	getFirstIngredientList() {
		const ingredients = this.recipeList
			.map((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient))
			.flat()
		return Array.from(new Set(ingredients))
	}

	getFirstApplianceList() {
		// Je crée un tableau d'appareils à partir du tableau de recettes en utilisant la méthode map pour récupérer l'appareil de chaque recette
		const appliances = this.recipeList.map((recipe) => recipe.appliance)
		return Array.from(new Set(appliances))
	}

	getFirstUstensilList() {
		const ustensils = this.recipeList.map((recipe) => recipe.ustensils).flat()
		return Array.from(new Set(ustensils))
	}

	// Méthode pour ajouter un tag dans le tableau des tags sélectionnés
	addTag(type, value) {
		// J'ajoute le tag dans le tableau des tags sélectionnés
		this.selectedTags.push({ type: type, value: value })
	}

	// Méthode pour supprimer un tag du tableau des tags sélectionnés
	removeTag(arrayToFilter, type, value) {
		// Je supprime le tag du tableau des tags sélectionnés en utilisant la méthode findIndex pour récupérer l'index du tag à supprimer
		let deletedTagIndex = arrayToFilter.findIndex((tag) => tag.value === value && tag.type === type)
		// puis la méthode splice pour supprimer le tag à l'index récupéré
		arrayToFilter.splice(deletedTagIndex, 1)
		this.selectedTags = arrayToFilter
	}

	getSelectedTags() {
		return this.selectedTags
	}

	// Méthode pour filtrer les recettes par nom, ingrédient, description dans le tableau recipes à partir du texte saisi dans la barre de recherche

	// Algorithme de recherche par mot-clé utilisant l'objet array
	getRecipesFilteredBySearch() {
		// Je vérifie si le tableau des recettes filtrées est vide, si oui je lui affecte le tableau de recettes
		this.filteredRecipes = this.filteredRecipes.length ? this.filteredRecipes : this.recipeList
		this.filteredRecipes = this.filteredRecipes.filter(
			(recipe) =>
				this.removeAccents(recipe.name.toLowerCase()).includes(this.removeAccents(this.mainSearch.toLowerCase())) ||
				recipe.ingredients.some((ingredient) =>
					this.removeAccents(ingredient.ingredient.toLowerCase()).includes(
						this.removeAccents(this.mainSearch.toLowerCase())
					)
				) ||
				this.removeAccents(recipe.description.toLowerCase()).includes(this.removeAccents(this.mainSearch.toLowerCase()))
		)
		return this.filteredRecipes
	}

	// Méthode pour filtrer les recettes par ingrédient, appareil et ustensile dans le tableau recipes à partir des tags sélectionnés
	getRecipesFilteredBySearchAndTags() {
		let filteredRecipes = this.getRecipesFilteredBySearch()
		this.selectedTags.forEach((tag) => {
			filteredRecipes = filteredRecipes.filter((recipe) => {
				if (tag.type === 'ingredients') {
					return recipe.ingredients.some(
						(ingredient) =>
							this.removeAccents(ingredient.ingredient.toLowerCase()) === this.removeAccents(tag.value.toLowerCase())
					)
				} else if (tag.type === 'appliances') {
					return this.removeAccents(recipe.appliance.toLowerCase()) === this.removeAccents(tag.value.toLowerCase())
				} else if (tag.type === 'ustensils') {
					return recipe.ustensils.some(
						(ustensil) => this.removeAccents(ustensil.toLowerCase()) === this.removeAccents(tag.value.toLowerCase())
					)
				}
			})
		})
		return filteredRecipes
	}

	getIngredientList() {
		const ingredients = []
		this.getRecipesFilteredBySearchAndTags().forEach((recipe) => {
			recipe.ingredients.forEach((ingredient) => {
				if (!ingredients.includes(ingredient.ingredient.toLowerCase())) {
					ingredients.push(ingredient.ingredient.toLowerCase())
				}
			})
		})
		return ingredients.sort()
	}

	getApplianceList() {
		const appliances = []
		this.getRecipesFilteredBySearchAndTags().forEach((recipe) => {
			if (!appliances.includes(recipe.appliance.toLowerCase())) {
				appliances.push(recipe.appliance.toLowerCase())
			}
		})
		return appliances.sort()
	}

	getUstensilList() {
		const ustensils = []
		this.getRecipesFilteredBySearchAndTags().forEach((recipe) => {
			recipe.ustensils.forEach((ustensil) => {
				if (!ustensils.includes(ustensil.toLowerCase())) {
					ustensils.push(ustensil.toLowerCase())
				}
			})
		})
		return ustensils.sort()
	}

	// Méthode pour réinitialiser la recherche lorsque l'utilisateur efface le texte saisi dans la barre de recherche ou supprime les tags
	resetRecipes() {
		this.filteredRecipes = [...this.recipeList]
		return this.filteredRecipes
	}
}
