import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recipe, RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfileComponent implements OnInit {

  private recipeService = inject(RecipeService);

  recipes = signal<Recipe[]>([]);

  user = {
    id: localStorage.getItem('userId') ?? '',
    name: localStorage.getItem('userName') ?? '',
    email: localStorage.getItem('email') ?? ''
  };

  ngOnInit(): void {
    this.recipeService
      .getRecipesByAuthor(this.user.id)
      .subscribe(recipes => {
        this.recipes.set(recipes);
      });
  }
}