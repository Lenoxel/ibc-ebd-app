import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullAccessGuard } from '../guards/full-access/full-access.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'lessons',
        loadChildren: () => import('../pages/lessons/lessons.module').then(m => m.LessonsPageModule)
      },
      {
        path: 'people',
        loadChildren: () => import('../pages/people/people.module').then(m => m.PeoplePageModule),
      },
      {
        path: 'people/:personId',
        loadChildren: () => import('../pages/people/people.module').then( m => m.PeoplePageModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('../pages/analytics/analytics.module').then(m => m.AnalyticsPageModule),
        canLoad: [FullAccessGuard],
      },
      {
        path: 'analytics/class',
        loadChildren: () => import('../pages/class-analytics/class-analytics.module').then( m => m.ClassAnalyticsPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/analytics',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/analytics',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
