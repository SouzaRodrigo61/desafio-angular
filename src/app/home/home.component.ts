import { CEP } from './../models/CEP.model';
import { CepService } from './../services/cep.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
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
  listCEPs: CEP[] = [];

  cepFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(8),
  ]);

  cepFilterFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(8),
  ]);

  UFFilterFormControl = new FormControl('', [Validators.required]);

  cityFilterFormControl = new FormControl('', [Validators.required]);

  cepSubscribe: Subscription;

  matcher = new MyErrorStateMatcher();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private serviceCEP: CepService) {
    // Assign the data to the data source for the table to render

    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.onChanges();
    this.onChangeCEP();
    this.onChangeUF();
    this.onChangeCity();
  }

  /**
   *
   * @description Subscreve no cep form para validar se possui alguma mudança e
   *              estiver tudo de acordo vai fazer a chamada da de forma direta
   *              para adicionar o novo CEP a lista.
   * @author Rodrigo Santos de Souza
   */
  onChanges(): void {
    this.cepFormControl.valueChanges.subscribe((val: string) => {
      if (val !== null && val !== '' && this.cepFormControl.errors === null) {
        this.cepSubscribe = this.serviceCEP.getDataOfCEP(val).subscribe(
          (response: CEP) => {
            /**
             *
             * Valida se o cep ja existe na listagem
             */
            if (
              !this.listCEPs.find((obj) => obj.cep === response.cep) ||
              response !== null
            ) {
              this.listCEPs.push(response);
              this.dataSource = new MatTableDataSource(this.listCEPs);
              
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

  onChangeCEP() {
    this.cepFilterFormControl.valueChanges.subscribe((val) => {
      this.dataSource.filter = val;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
  }

  onChangeUF() {
    this.UFFilterFormControl.valueChanges.subscribe((val) => {
      this.dataSource.filter = val;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
  }

  onChangeCity() {
    this.cityFilterFormControl.valueChanges.subscribe((val) => {
      this.dataSource.filter = val;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
  }

  handleClick(event: Event) {
    console.log('limpar ', event);
    this.cepFilterFormControl.setValue(null);
    this.UFFilterFormControl.setValue(null);
    this.cityFilterFormControl.setValue(null);
  }
}
