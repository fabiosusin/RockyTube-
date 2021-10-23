import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quantity'
})
export class QuantityPipe implements PipeTransform {

    private DECIMALS = 2;
    private DECIMAL_DIVIDER = ',';
    private THOUSANDS_DIVIDER = '.';

  transform(value: any): any {
    if (!value) return (0).toFixed(this.DECIMALS);;

    let val = value;

    val = parseFloat(val).toFixed(this.DECIMALS);
    
    let num: number = Number(String(val).match(/\d+/g).join(''));
    val = num.toString().padStart(1 + this.DECIMALS, '0');
    let rev = String(val).split('').reverse();

    for (let i = 0, j = 0; i < rev.length; i++) {

      if (i === this.DECIMALS) {
        rev = rev.concat(rev.splice(i, rev.length - (i - 1), this.DECIMAL_DIVIDER));
      }

      if ((i - (j * 4) - (this.DECIMALS + 1)) === 3) {
        rev = rev.concat(rev.splice(i, rev.length - (i - 1), this.THOUSANDS_DIVIDER));
        j++;
      }
    }

    let formatted = rev.reverse().join('');

    if (formatted.indexOf(this.DECIMAL_DIVIDER) == (formatted.length - 1)) {
      formatted = formatted.slice(0, formatted.length - 1);
    }

    if (value < 0) {
      formatted = '-' + formatted;
    }

    return formatted;
  }
}
