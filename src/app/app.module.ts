import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthModule } from './pages/auth/auth.module';
import { RouterModule } from '@angular/router';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { HomeModule } from './pages/home/home.module';
import { AuthInterceptor } from './service/auth.interceptor';
import { BoardsModule } from './pages/boards/boards.module';
import { AppRoutingModule } from './app-routing.module';
import { BoardModule } from './components/board/board.module';
import { LoadingService } from './service/loading.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    RouterModule,
    SnotifyModule,
    HomeModule,
    BoardsModule,
    AppRoutingModule,
    BoardModule
  ],
  providers: [
    {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    LoadingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
