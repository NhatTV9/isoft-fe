import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { SearchResult, TypeData } from 'src/app/models/common.model';
import { DocumentModel } from 'src/app/models/document.model';
import { DocumentService } from 'src/app/service/document.service';
import { DocumentFormComponent } from './components/document-form/document-form.component';
@Component({
    selector: 'app-type-of-document',
    templateUrl: './type-of-document.component.html',
    styles: [``],
    providers: [ConfirmationService],
})
export class TypeOfDocumentComponent implements OnInit {
    @ViewChild('documentForm') documentFormComponent: DocumentFormComponent | undefined;
    loading: boolean = true;
    public first =0;
    public lstLicense: DocumentModel [] =[];
    public pendingRequest: any;
    public totalRecords = 0;
    public totalPages = 0;
    public nextStt =0;
    formData: any ={};

    display: boolean = false;
    isEdit: boolean = false;

    constructor(
        private readonly documentService: DocumentService,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
    ) {}
    public getParams ={
        page: 0,
        _pagesize: 20,
    }

    ngOnInit(): void {
        // this.getdocument()
    }
    onSearch(event) {
        if (event.key === 'Enter') {
            // this.getdocument();
        }
    }
    showDialog() {
        // this.documentFormComponent.onReset();
        this.display = true;
    }
   

    getdocument(event?: any){
        
        if(this.pendingRequest){
            this.pendingRequest.unsubscribe();
        }
        this.loading = true;
        this.pendingRequest = this.documentService.getDocuments(this.getParams).subscribe((response: TypeData<DocumentModel>)=>{
            this.lstLicense = response.data;
            this.totalRecords = response.totalItems;
            this.totalPages =  response.totalItems / response.pageSize+1;
            this.nextStt = response.nextStt;
            this.loading = false;
            
        })
    }
    onDelete(documentId) {
        let message;
        this.translateService
            .get('question.delete_document_content')
            .subscribe((res) => {
                message = res;
            });
      
        this.confirmationService.confirm({
            message: message,
            accept: () => {
               this.documentService.deleteDocument(documentId).subscribe((response: DocumentModel)=>{
               } )
               this.getdocument()
            },
        });
    }
    getDetail(documentId) {
        this.documentService.getDocumentWithID(documentId).subscribe((response: DocumentModel)=>{
            this.formData = response;
            this.isEdit = true;
            this.showDialog()
        })
       
    }
}
