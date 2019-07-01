import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VotingComponent } from './components/voting/voting.component';
import { ResultsComponent } from './components/results/results.component';
import { RouterModule, Route } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { VerifyComponent } from './components/verify/verify.component';
const routes: Route[] = [
  {path: 'vote', component: VotingComponent},
  {path: 'results', component: ResultsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'verify', component: VerifyComponent},
  {path: '**', component: LoginComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    VotingComponent,
    ResultsComponent,
    LoginComponent,
    VerifyComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
