import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyQuestionsResolver } from './resolvers/my-questions.resolver';
import { UserGuard } from './guards/user.guard';


const routes: Routes = [
  { path: 'landing', loadChildren: () => import('./pages/landing-page/landing-page.module').then(m => m.LandingPageModule) },
  { path: 'home', loadChildren: () => import("./pages/home-page/home-page.module").then(e => e.HomePageModule)  },
  { path: 'questions', loadChildren: () => import("./pages/home-page/home-page.module").then(e => e.HomePageModule), resolve: {questions: MyQuestionsResolver}, canActivateChild:[UserGuard]  },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', redirectTo: '/landing', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {   onSameUrlNavigation: 'ignore' })],
  exports: [RouterModule],
  providers: [MyQuestionsResolver, UserGuard]
})
export class AppRoutingModule { }
