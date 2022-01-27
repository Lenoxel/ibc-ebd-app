import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./pages/analytics/analytics.module').then( m => m.AnalyticsPageModule)
  },
  {
    path: 'lessons',
    loadChildren: () => import('./pages/lessons/lessons.module').then( m => m.LessonsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
