import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Utils } from 'src/shared/utils';
import { BasePage } from './base.component';

export class BaseEdit<T> extends BasePage {

    constructor(
        protected router: Router,
        protected utils: Utils) {
        super(router, utils);
    }

    public form: FormGroup;
    public tab: number = 0;

    onClickChangeTab = (newTab: number) => this.tab = newTab;

    inValidateForm = async () => this.form.invalid;
    assignForm = async (_item: T) => { };
    onSubmit = async (_item: T) => { };
    errors = () => { };
}
