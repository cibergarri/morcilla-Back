import { StatsResolver } from './resolvers/stats.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyQuestionsResolver } from './resolvers/my-questions.resolver';
import { UserGuard } from './guards/user.guard';


const routes: Routes = [
  { path: 'landing', loadChildren: () => import('./pages/landing-page/landing-page.module').then(m => m.LandingPageModule) },
  { path: 'home', loadChildren: () => import("./pages/home-page/home-page.module").then(e => e.HomePageModule)  },
  { path: 'questions', loadChildren: () => import("./pages/home-page/home-page.module").then(e => e.HomePageModule), resolve: {questions: MyQuestionsResolver}, canActivateChild:[UserGuard]  },
  { path: 'stats', loadChildren: () => import("./pages/stats-page/stats-page.module").then(e => e.StatsPageModule), resolve: {stats: StatsResolver}, canActivateChild:[UserGuard]  },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', redirectTo: '/landing', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {   onSameUrlNavigation: 'ignore' })],
  exports: [RouterModule],
  providers: [MyQuestionsResolver, UserGuard, StatsResolver]
})
export class AppRoutingModule { }
