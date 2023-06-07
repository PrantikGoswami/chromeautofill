import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { WithVoiceComponent } from './landing/with-voice/with-voice.component';
import { WithoutVoiceComponent } from './landing/without-voice/without-voice.component';
import { BlankFormComponent } from './landing/blank-form/blank-form.component';
import { FilledFormComponent } from './landing/filled-form/filled-form.component';
import { ExperimentComponent } from './landing/experiment/experiment.component';


const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full'
  },
  {
    path: 'voice',
    component: WithVoiceComponent,
  },
  {
    path: 'noVoice',
    component: WithoutVoiceComponent,
  },
  {
    path: 'voice/experiment',
    component: ExperimentComponent,
  },
  {
    path: 'noVoice/experiment',
    component: ExperimentComponent,
  },
  {
    path: 'voice/t1/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'voice/t2/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'voice/e1/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'voice/e2/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'voice/e3/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'voice/e4/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'noVoice/t1/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'noVoice/t2/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'noVoice/e1/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'noVoice/e2/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'noVoice/e3/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'noVoice/e4/blankform',
    component: BlankFormComponent,
  },
  {
    path: 'voice/t1/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'voice/t2/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'voice/e1/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'voice/e2/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'voice/e3/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'voice/e4/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'noVoice/t1/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'noVoice/t2/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'noVoice/e1/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'noVoice/e2/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'noVoice/e3/filledform',
    component: FilledFormComponent,
  },
  {
    path: 'noVoice/e4/filledform',
    component: FilledFormComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule],
  declarations: [LandingComponent, WithVoiceComponent, WithoutVoiceComponent, BlankFormComponent, FilledFormComponent, ExperimentComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
