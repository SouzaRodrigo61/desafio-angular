import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { CEP } from './../models/CEP.model';
import { CepService } from './../services/cep.service';
import { MyErrorStateMatcher } from './../services/my-error-state-matcher.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  /**
   *
   * @description Variaveis para tabela de CEPs
   */
  displayedColumns: string[] = [
    'cep',
    'logradouro',
    'complemento',
    'bairro',
    'localidade',
    'uf',
    'unidade',
    'ibge',
    'gia',
    'Acao',
  ];

  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource: MatTableDataSource<CEP>;

  /**
   *
   * @description variaveis de formulario
   */
  cepFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10),
  ]);

  cepFilterFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10),
  ]);

  UFFilterFormControl = new FormControl('', [Validators.required]);

  cityFilterFormControl = new FormControl('', [Validators.required]);

  matcher: MyErrorStateMatcher;

  /**
   *
   * @description Variaves de subscriptions
   */
  cepSubscribe: Subscription;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /**
   *
   * @author Rodrigo Santos de Souza
   * @description Preencher o campo do table source para um array vazio
   */
  constructor(private serviceCEP: CepService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matcher = new MyErrorStateMatcher();

    this.onChanges();
    this.onChangeCEP();
    this.onChangeUF();
    this.onChangeCity();
  }

  /**
   *
   * @author Rodrigo Santos de Souza
   * @description Subscreve no cep form para validar se possui alguma mudança e
   *              estiver tudo de acordo vai fazer a chamada da de forma direta
   *              para adicionar o novo CEP a lista.
   */
  onChanges(): void {
    this.cepFormControl.valueChanges.subscribe((val: string) => {
      if (val !== null && val !== '' && this.cepFormControl.errors === null) {
        val = val.replace('.', '');
        val = val.replace('-', '');

        this.cepSubscribe = this.serviceCEP.getDataOfCEP(val).subscribe(
          (response: CEP) => {
            /**
             *
             * Valida se o cep ja existe na listagem
             */
            if (
              !this.dataSource.data.find((obj) => obj.cep === response.cep) ||
              response !== null
            ) {
              this.dataSource.data = [...this.dataSource.data, response];
            }

            this.cepFormControl.setValue(null);
          },
          (err: HttpErrorResponse) => {
            console.log('Error: ', err);
          }
        );
      }
    });
  }

  /**
   *
   * @author Rodrigo Santos de Souza
   * @description Se tiver alteração no formulario de filtro de cep
   *              fazer uma filtragem na tabela pelas cidades mapeadas
   *              no array de CEPs
   */
  onChangeCEP() {
    this.cepFilterFormControl.valueChanges.subscribe((val) => {
      val = val.replace('.', '');
      this.dataSource.filter = val;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
  }

  /**
   *
   * @author Rodrigo Santos de Souza
   * @description Se tiver alteração no formulario de filtro de uf
   *              fazer uma filtragem na tabela pelas cidades mapeadas
   *              no array de CEPs
   */
  onChangeUF() {
    this.UFFilterFormControl.valueChanges.subscribe((val) => {
      this.dataSource.filter = val;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
  }

  /**
   *
   * @author Rodrigo Santos de Souza
   * @description Se tiver alteração no formulario de filtro de cidade
   *              fazer uma filtragem na tabela pelas cidades mapeadas
   *              no array de CEPs
   */
  onChangeCity() {
    this.cityFilterFormControl.valueChanges.subscribe((val) => {
      this.dataSource.filter = val;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
  }

  /**
   *
   * @author Rodrigo Santos de Souza
   * @description Limpar todos os campos de filtragem
   */
  handleClick() {
    this.cepFilterFormControl.setValue(null);
    this.UFFilterFormControl.setValue(null);
    this.cityFilterFormControl.setValue(null);
  }

  /**
   *
   * @param row Cep
   * @author Rodrigo Santos de Souza
   * @description Remover todos os campos da lista de CEPs
   */
  handleRemove(row: CEP): void {
    const data = this.dataSource.data.filter((obj) => obj.cep !== row.cep);
    this.dataSource.data = [...data];
  }
}
