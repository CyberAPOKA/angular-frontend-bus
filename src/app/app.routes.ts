import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './results/results.component';
import { SeatsComponent } from './seats/seats.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'onibus', component: ResultsComponent },
  { path: 'poltrona', component: SeatsComponent },
];
