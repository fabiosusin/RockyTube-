import { Directive, ElementRef, OnChanges, Attribute, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { KeysNames } from 'src/models/directives/key-names';

@Directive({
  selector: '[cpfcnpj], [cpf], [cnpj]'
})

export class CpfCnpjDirective implements OnChanges {
  private allowedKeys: string[] = [
    ...KeysNames.controls,
    ...KeysNames.numbers
  ];

  private allowedKeysWithControl: string[] = [
    ...KeysNames.clipboard,
    KeysNames.a
  ];

  onlyCpf: boolean;
  onlyCnpj: boolean;

  constructor(
    public control: NgControl,
    public ele: ElementRef,
    @Attribute('cpfcnpj') public cpfcnpj: string,
    @Attribute('cpf') public cpf: string,
    @Attribute('cnpj') public cnpj: string
  ) {
    this.onlyCpf = !this.cpfcnpj && this.cpf != null;
    this.onlyCnpj = !this.cpfcnpj && this.cnpj != null;
  }

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

    const pattern = this.onlyCpf || (!this.onlyCnpj && value.length <= 11) ? '###.###.###-##' : '##.###.###/####-##';
    let i = 0;
    let formatted = pattern.replace(/#/g, _ => (value[i] ? value[i++] : ''));

    // Remove os caracteres especiais ainda não usados na máscara
    formatted = formatted.match(/(.*)\d/)[0].toString();

    this.control.valueAccessor.writeValue(formatted);
    this.control.control.setValue(value, { emitEvent: false, emitModelToViewChange: false });
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    !this.allowedKeys.includes(event.key) &&
    !(this.allowedKeysWithControl.includes(event.key) && (event.ctrlKey || event.metaKey)) &&
    event.preventDefault();
  }
}