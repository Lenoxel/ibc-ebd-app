import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { AutoLoginGuard } from './guards/auto-login/auto-login.guard';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [AutoLoginGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'lesson/:lessonId/classes',
    loadChildren: () => import('./pages/lesson-classes/lesson-classes.module').then( m => m.LessonClassesPageModule)
  },
  {
    path: 'lesson/:lessonId/classes/:classId/presences',
    loadChildren: () => import('./pages/lesson-class-presences/lesson-class-presences.module').then( m => m.LessonClassPresencesPageModule)
  },
  {
    path: 'people',
    loadChildren: () => import('./pages/people/people.module').then( m => m.PeoplePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
