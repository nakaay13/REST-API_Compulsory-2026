import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService, Recipe } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  templateUrl: './recipe-form.html',
  styleUrls: ['./recipe-form.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
})
export class RecipeFormComponent implements OnInit {
  recipe: Recipe = {
    title: '',
    imageUrl: '',
    description: '',
    ingredients: [],
    instructions: [],
  };

  ingredientsStr = '';
  instructionsStr = '';
  isEdit = false;
  id: string | null = null;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.isEdit = true;
      this.recipeService.getOne(this.id).subscribe(recipe => {
        this.recipe = recipe;
        this.ingredientsStr = recipe.ingredients.join(', ');
        this.instructionsStr = recipe.instructions.join(', ');
      });
    }
  }

  save() {
  this.recipe.ingredients = this.ingredientsStr
    .split(',')
    .map(i => i.trim())
    .filter(Boolean);

  this.recipe.instructions = this.instructionsStr
    .split(',')
    .map(i => i.trim())
    .filter(Boolean);

  // ✅ IMPORTANT: attach logged-in user id
  const userId = localStorage.getItem('userId');
  if (userId) {
    this.recipe._createdBy = userId;
  }

  if (this.isEdit && this.id) {
    this.recipeService
      .update(this.id, this.recipe)
      .subscribe(() => this.router.navigate(['/recipes']));
  } else {
    this.recipeService
      .create(this.recipe)
      .subscribe(() => this.router.navigate(['/recipes']));
  }
}
}