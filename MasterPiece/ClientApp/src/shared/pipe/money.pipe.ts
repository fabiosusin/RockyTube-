import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'money'
})
export class MoneyPipe implements PipeTransform {

    private DECIMALS = 2;
    private DECIMAL_DIVIDER = ',';
    private THOUSANDS_DIVIDER = '.';

    transform(value: any, prefix: string = ''): any {
        if (!value) return prefix + parseFloat("0").toFixed(this.DECIMALS);;

        value = parseFloat(value).toFixed(this.DECIMALS);

        let num: number = Number(String(value).match(/\d+/g).join(''));
        value = num.toString().padStart(1 + this.DECIMALS, '0');
        let rev = String(value).split('').reverse();

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

        return prefix + formatted;
    }
}
