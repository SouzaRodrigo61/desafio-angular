import { CEP } from './../models/CEP.model';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CepService {
  constructor(private http: HttpClient) {}

  /// Get - data of CEP
  getDataOfCEP(cep: string): Observable<CEP> {
    return this.http.get<CEP>(`https://viacep.com.br/ws/${cep}/json`);
  }
}
