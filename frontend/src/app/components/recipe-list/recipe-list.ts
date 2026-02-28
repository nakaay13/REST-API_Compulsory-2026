import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  templateUrl: './recipe-list.html',
  styleUrls: ['./recipe-list.scss'], // <-- import your SCSS here
  imports: [CommonModule, RouterModule],
})
export class RecipeListComponent implements OnInit {
  // signal of array
  recipes = signal<Recipe[]>([]);

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getAll().subscribe({
      next: data => this.recipes.set(data), // update signal
      error: err => console.error('Failed to load recipes', err),
    });
  }

  deleteRecipe(id?: string) {
    if (!id) return;
    this.recipeService.delete(id).subscribe(() => this.loadRecipes());
  }

  editRecipe(id?: string) {
    if (!id) return;
    this.router.navigate(['/recipes/edit', id]);
  }
}