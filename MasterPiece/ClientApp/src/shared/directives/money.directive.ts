import { Attribute, Directive, ElementRef, HostListener, Input, OnChanges, SimpleChange } from '@angular/core';
import { NgControl } from '@angular/forms';
import { KeysNames } from 'src/models/directives/key-names';
import { NumberMaskOptions } from 'src/models/directives/number-mask-options';


@Directive({
  selector: '[money]'
})
export class MoneyDirective implements OnChanges {
  private allowedKeys: string[] = [
    ...KeysNames.controls,
    ...KeysNames.numbers,
    KeysNames.minus
  ];

  private allowedKeysWithControl: string[] = [
    ...KeysNames.clipboard,
    KeysNames.a
  ];

  onlyMoney: boolean;
  onlyPercent: boolean;
  options: NumberMaskOptions = new NumberMaskOptions();

  @Input() public money: NumberMaskOptions;

  constructor(
    public control: NgControl,
    public ele: ElementRef,
    @Attribute('money') public num: number
  ) {
  }

  onFocus() {
    setTimeout(() =>
      this.ele &&
      this.ele.nativeElement &&
      this.ele.nativeElement.children &&
      this.ele.nativeElement.children[0] &&
      this.ele.nativeElement.children[0].setSelectionRange(-1, -1), 1);
  }

  ngOnChanges() {
    this.onInputChange();
  }

  ngOnInit() {
    this.onlyMoney = this.num == undefined && this.money != undefined;

    this.assignEvent();
    this.onInputChange();
  }

  assignEvent() {
    this.control.valueChanges.subscribe(() => this.onInputChange());
    this.onInputChange();
  }

  onInputChange() {
    Object.assign(this.options);

    let value: string | number = this.control.value || 0;
    const model: string | number = (this.control as any).viewModel;

    if (typeof value == 'number')
      value = value.toFixed(this.options.decimals);

    // Feito isso pois como o percent está no final do valor, quando o cara tenta apagar o número,
    // apaga primeiro o % e visualmente parece que não teve alteração.
    // Dessa forma da pra saber que o usuário está apagando o campo e então é só tirar o último caracter da string.
    if (this.onlyPercent && value.toString().indexOf('%') < 0 && typeof value !== 'number')
      value = value.toString().substring(0, value.toString().length - 1);

    const isNegative = (value || '').toString().indexOf('-') == 0;
    // When value is loaded from database it grants is handled as a decimal number
    model === value && (value = parseFloat(model).toFixed(this.options.decimals));

    let num: number = Number((String(value).match(/\d+/g) || []).join(''));
    value = num.toString().padStart(1 + this.options.decimals, '0');
    num = num / Math.pow(10, this.options.decimals);

    isNegative && (num *= -1);

    let rev = String(value)
      .split('')
      .reverse();

    for (let i = 0, j = 0; i < rev.length; i++) {
      if (i === this.options.decimals)
        rev = rev.concat(rev.splice(i, rev.length - (i - 1), this.options.decimalDivider));
      if (i - j * 4 - (this.options.decimals + 1) === 3) {
        rev = rev.concat(rev.splice(i, rev.length - (i - 1), this.options.thousandsDivider));
        j++;
      }
    }

    let formatted = (isNegative ? '-' : '') + rev.reverse().join('');
    formatted = this.onlyMoney ? `R$ ${formatted}` : this.onlyPercent ? `${formatted}%` : formatted;

    this.control.viewToModelUpdate(num);
    this.control.valueAccessor.writeValue(formatted);

    // Need to setValue without emit event to not raise ngOnChanges again
    this.control.control.setValue(num, { emitEvent: false, emitModelToViewChange: false });
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    !this.allowedKeys.includes(event.key) &&
      !(this.allowedKeysWithControl.includes(event.key) && (event.ctrlKey || event.metaKey)) &&
      event.preventDefault();
  }
}