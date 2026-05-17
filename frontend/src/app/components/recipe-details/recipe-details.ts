import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Recipe, RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-details.html',
  styleUrls: ['./recipe-details.scss'],
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe | null = null;
  loading = true;
  error = '';

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Recipe not found';
      this.loading = false;
      return;
    }

    this.recipeService.getOne(id).subscribe({
      next: recipe => {
        this.recipe = recipe;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load recipe details', err);
        this.error = 'Unable to load recipe details';
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }
}
