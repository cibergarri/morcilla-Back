import { PushService } from './services/push.service';
import { AuthInterceptor } from './auth.interceptor';
import { AlertsService } from './services/alerts.service';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { TimeoutInterceptor } from './timeout.interceptor';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { QuestionsService } from './services/questions.service';
import { TopicsService } from './services/topics.service';

registerLocaleData(localeEs, 'es');


library.add(fas, fab, far);


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FontAwesomeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
    SharedModule,
  ],
  providers: [
    AuthService,
    AlertsService,
    QuestionsService, 
    TopicsService,
    PushService,
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
      { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
