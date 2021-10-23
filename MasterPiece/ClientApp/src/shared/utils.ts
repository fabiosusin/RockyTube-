import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class Utils {
    constructor(protected toastr: ToastrService) { }

    informationMessage(
        message: string,
        title?: string,
        duration: number = 9000
    ) {
        this.toastr.info(message, title, {
            timeOut: duration,
            extendedTimeOut: duration,
            progressBar: true,
            enableHtml: true
        });
    }

    warningMessage(
        message: string,
        title?: string,
        duration: number = 9000
    ) {
        this.toastr.warning(message, title, {
            timeOut: duration,
            extendedTimeOut: duration,
            progressBar: true,
            enableHtml: true
        });
    }

    successMessage(
        message: string,
        title?: string,
        duration: number = 3000
    ) {
        this.toastr.success(message, title, {
            timeOut: duration,
            extendedTimeOut: duration,
            progressBar: true,
            enableHtml: true
        });
    }

    errorMessage(
        message: string,
        title?: string,
        duration: number = 18000
    ) {
        this.toastr.error(message, title, {
            timeOut: duration,
            extendedTimeOut: duration,
            progressBar: true,
            enableHtml: true,
            onActivateTick: true
        });
    }

    static getErrorMessageFromHttpResponse(response: any) {
        console.debug('Response Error API =>', response);
        if (typeof response == 'object') {
            if (typeof response.error == 'string')
                return response.error;

            if (typeof response.error == 'object' && response.error) {
                if (typeof response.error.exceptionMessage == 'string')
                    return response.error.exceptionMessage;
                if (typeof response.error.message == 'string')
                    return response.error.message;
            }
        }
        return 'Ops! Algo deu errado';
    }

}