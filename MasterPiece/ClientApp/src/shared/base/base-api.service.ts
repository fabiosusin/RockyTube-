import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { Utils } from "../utils";

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  constructor(protected httpClient: HttpClient) { }


  // bearerToken = async (): Promise<string> =>
  //   await this.getAuthenticationToken();

  // async getAuthenticationToken() {
  //   try {
  //     var token = this.cookieService.get('erpusertoken');
  //     return token && token.length > 0 ? token : await this.renewAutenticationToken();
  //   }
  //   catch { }
  // }

  // protected getRequestHeaders = async (): Promise<HttpHeaders> =>
  //   new HttpHeaders({
  //     'Content-Type': 'application/json; charset=UTF-8',
  //     Accept: 'application/json, text/plain, */*',
  //     Authorization: `Bearer ${await this.getAuthenticationToken()}`
  //   });

  // async renewAutenticationToken(): Promise<string> {
  //   try {
  //     return await this.get(`${this.getBaseURL()}/masterajax/bearertoken`, null).then((token: any) => {
  //       if (token && token.indexOf('DOCTYPE') < 0) {
  //         this.cookieService.set('erpusertoken', token, null, '/');
  //         return token;
  //       }

  //       return undefined;

  //     }).catch(() => {
  //       window.location = `${this.getBaseURL()}/logout`;
  //       return undefined;
  //     });
  //   } catch {
  //     window.location = `${this.getBaseURL()}/logout`;
  //     return undefined;
  //   }
  // }

  protected getRequestHeaders = async (): Promise<HttpHeaders> =>
    new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    });

  private async request(method: string, args: any[]): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      this.httpClient[method](...args).toPromise().then((retorno: any) => {
        console.debug('retorno API =>', retorno)
        if (!retorno)
          resolve(null);

        resolve(retorno);
      }).catch(async (error: HttpErrorResponse) => {
        reject(Utils.getErrorMessageFromHttpResponse(error));
      });
    });
  }

  protected get = async (url: string, headers: HttpHeaders = undefined): Promise<any> =>
    await this.request('get', [environment.baseUrlApi + url, { headers }]);

  protected customGet = async (url: string, options: Object = {}): Promise<any> =>
    await this.request('get', [environment.baseUrlApi + url, options]);

  protected post = async (url: string, body: any = undefined, headers: HttpHeaders = undefined): Promise<any> =>
    await this.request('post', [environment.baseUrlApi + url, body, { headers }]);

  protected put = async (url: string, body: any = undefined, headers: HttpHeaders = undefined): Promise<any> =>
    await this.request('put', [environment.baseUrlApi + url, body, { headers }]);

  protected patch = async (url: string, body: any = undefined, headers: HttpHeaders = undefined): Promise<any> =>
    await this.request('patch', [environment.baseUrlApi + url, body, { headers }]);

  protected delete = async (url: string, headers: HttpHeaders = undefined, body: any = undefined): Promise<any> =>
    await this.request('request', ['delete', environment.baseUrlApi + url, { body, headers }]);

}