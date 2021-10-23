import { UserService } from 'src/shared/services/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/shared/services/api.service';
import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { Utils } from 'src/shared/utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickOutsideDirective } from 'src/shared/directives/click-outside.directive';
import { NgxCurrencyModule } from 'ngx-currency';
@NgModule({
  declarations: [
    AppComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule // ToastrModule added
  ],
  providers: [
    Utils,
    ApiService,
    UserService
  ],
  exports: [
    ClickOutsideDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
