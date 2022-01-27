import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'lessons',
        loadChildren: () => import('../pages/lessons/lessons.module').then(m => m.LessonsPageModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('../pages/analytics/analytics.module').then(m => m.AnalyticsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/lessons',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/lessons',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
