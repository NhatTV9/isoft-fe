import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChartOfAccount } from '../models/case.model';
import { Page, TypeData } from '../models/common.model';
import { DocumentModel } from '../models/document.model';
import AppConstant from '../utilities/app-constants';

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    _baseUrl = AppConstant.DEFAULT_URLS.API;
    constructor(private readonly httpClient: HttpClient) {}

    public getDocuments(params: any): Observable<TypeData<DocumentModel>> {
        const url: string = this._baseUrl + '/documents';
        return this.httpClient.get(url, { params }).pipe(
            map((document: TypeData<DocumentModel>) => {
                return document;
            })
        );
    }

    public getAllActiveDocument(): Observable<TypeData<DocumentModel>> {
        const url: string = this._baseUrl + `/documents/list`;
        return this.httpClient.get(url, {}).pipe(
            map((document: TypeData<DocumentModel>) => {
                return document;
            })
        );
    }

    public getDocumentWithID(id: number): Observable<DocumentModel> {
        const url: string = this._baseUrl + `/Documents/${id}`;
        return this.httpClient.get(url, {}).pipe(
            map((document: DocumentModel) => {
                return document;
            })
        );
    }

    public createDocument(
        document: DocumentModel
    ): Observable<DocumentModel | null> {
        const url: string = this._baseUrl + '/Documents/Save';
        return this.httpClient.post(url, document).pipe(
            map((document: DocumentModel) => {
                return document;
            })
        );
    }

    public updateDocument(
        id: number,
        document: DocumentModel
    ): Observable<DocumentModel> {
        const url: string = this._baseUrl + `/documents/Save/${id}`;
        return this.httpClient.post(url, document).pipe(
            map((document: DocumentModel) => {
                return document;
            })
        );
    }

    public deleteDocument(id: number): Observable<DocumentModel | null> {
        const url: string = this._baseUrl + `/Documents/${id}`;
        return this.httpClient.delete(url, {}).pipe(
            map((document: DocumentModel) => {
                return document;
            })
        );
    }
    public getAllByDisplayInsert(): Observable<TypeData<ChartOfAccount>> {
        const url: string = this._baseUrl + `/ChartOfAccounts/getAllByDisplayInsert`;
        return this.httpClient.get(url, {}).pipe(
            map((document: TypeData<ChartOfAccount>) => {
                return document;
            })
        );
    }
    public getAllUserActive(): Observable<TypeData<DocumentModel>> {
        const url: string = this._baseUrl + `/Users/getAllUserActive`;
        return this.httpClient.get(url, {}).pipe(
            map((document: TypeData<DocumentModel>) => {
                return document;
            })
        );
    }
}
