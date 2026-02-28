import { Component, OnInit } from '@angular/core';
import { RecipeService, Recipe } from '../../services/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>{{ isEdit ? 'Edit' : 'Create' }} Recipe</h2>
    <form (ngSubmit)="save()">
      <input type="text" [(ngModel)]="recipe.title" name="title" placeholder="Title" required />
      <input type="text" [(ngModel)]="recipe.imageUrl" name="imageUrl" placeholder="Image URL" required />
      <textarea [(ngModel)]="recipe.description" name="description" placeholder="Description" required></textarea>
      <textarea [(ngModel)]="ingredientsStr" name="ingredients" placeholder="Ingredients (comma separated)"></textarea>
      <textarea [(ngModel)]="instructionsStr" name="instructions" placeholder="Instructions (comma separated)"></textarea>
      <button type="submit">Save</button>
    </form>
  `
})
export class RecipeFormComponent implements OnInit {
  recipe: Recipe = { title: '', imageUrl: '', description: '', ingredients: [], instructions: [] };
  ingredientsStr = '';
  instructionsStr = '';
  isEdit = false;
  id: string | null = null;

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.recipeService.getOne(this.id).subscribe(r => {
        this.recipe = r;
        this.ingredientsStr = r.ingredients.join(', ');
        this.instructionsStr = r.instructions.join(', ');
      });
    }
  }

  save() {
    this.recipe.ingredients = this.ingredientsStr.split(',').map(s => s.trim());
    this.recipe.instructions = this.instructionsStr.split(',').map(s => s.trim());

    if (this.isEdit && this.id) {
      this.recipeService.update(this.id, this.recipe).subscribe(() => this.router.navigate(['/recipes']));
    } else {
      this.recipeService.create(this.recipe).subscribe(() => this.router.navigate(['/recipes']));
    }
  }
}