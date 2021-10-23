import { QuantityPipe } from './../../shared/pipe/quantity.pipe';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatSliderModule, MatSlideToggleModule, MatTableModule } from '@angular/material';
import { LoaderComponent } from 'src/shared/components/loader/loader.component';
import { MoneyDirective } from 'src/shared/directives/money.directive';
import { CpfCnpjDirective } from 'src/shared/directives/cpf-cnpj.directive';
import { ZipCodeDirective } from 'src/shared/directives/zip-code.directive';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MoneyPipe } from 'src/shared/pipe/money.pipe';

@NgModule({
  declarations: [
    LoaderComponent,
    MoneyDirective,
    CpfCnpjDirective,
    ZipCodeDirective,
    QuantityPipe,
    MoneyPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    TooltipModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSliderModule
  ],
  exports: [
    MoneyDirective,
    CpfCnpjDirective,
    ZipCodeDirective,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatTableModule,
    LoaderComponent,
    TooltipModule,
    QuantityPipe,
    MoneyPipe
  ],
  providers: [
    QuantityPipe,
    MoneyPipe
  ]
})
export class AppCommonModule { }