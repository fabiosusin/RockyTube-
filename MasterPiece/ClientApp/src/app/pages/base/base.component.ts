import { Router } from '@angular/router';
import { Utils } from 'src/shared/utils';

export class BasePage {
    constructor(
        protected router: Router,
        protected utils: Utils) {
        this.dataReceived = this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras ?
            this.router.getCurrentNavigation().extras.state : null;
    }

    isLoading: boolean;
    dataReceived: any;

    showValidationsError(messages: string[], title = 'Os seguintes erros foram encontrados!') {
        this.utils.errorMessage(messages.join('\r\n'), title)
    }
}
