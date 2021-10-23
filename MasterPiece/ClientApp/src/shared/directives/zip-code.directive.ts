import { Directive, Attribute, HostListener, OnChanges, OnInit } from '@angular/core';
import { DefaultValueAccessor, NgControl } from '@angular/forms';
import { KeysNames } from 'src/models/directives/key-names';

@Directive({
  selector: '[zipCode]',
  providers: [DefaultValueAccessor]
})
export class ZipCodeDirective implements OnChanges, OnInit {
  private allowedKeys: string[] = [
    ...KeysNames.controls,
    ...KeysNames.numbers
  ];

  private allowedKeysWithControl: string[] = [
    ...KeysNames.clipboard,
    KeysNames.a
  ];
  
  constructor(public control: NgControl, @Attribute('zipCode') public zipCode: string) {}

  ngOnChanges() {
    this.onInputChange();
  }

  ngOnInit() {
    this.assignEvent();
    this.onInputChange();
  }

  assignEvent() {
    this.control.valueChanges.subscribe(() => this.onInputChange());
    this.onInputChange();
  }

  onInputChange() {
    if (!this.control.value)
      return;

    let value: string = this.control.value.toString();
    const model: string = (this.control as any).viewModel;

    if (!value || !String(value).match(/\d+/g))
      return;

    value = (model === value ? model : value).match(/\d+/g).join('');

    const pattern = '#####-###';
    let i = 0;
    let formatted = pattern.replace(/#/g, _ => (value[i] ? value[i++] : ''));
    formatted = formatted.match(/(.*)\d/)[0].toString();

    this.control.viewToModelUpdate(value);
    this.control.valueAccessor.writeValue(formatted);
    this.control.control.setValue(value, { emitEvent: false, emitModelToViewChange: false });
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    !this.allowedKeys.includes(event.key) &&
    !(this.allowedKeysWithControl.includes(event.key) && (event.ctrlKey || event.metaKey)) &&
    event.preventDefault();
  }
}