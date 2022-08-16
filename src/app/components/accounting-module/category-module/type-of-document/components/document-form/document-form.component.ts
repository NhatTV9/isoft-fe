import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ChartOfAccount } from 'src/app/models/case.model';
import { Page } from 'src/app/models/common.model';
import { DocumentService } from 'src/app/service/document.service';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',

})
export class DocumentFormComponent implements OnInit {
  @Input('display') display: boolean = true;
  @Input('nextStt') nextStt;
  @Input('isEdit') isEdit;
  @Input('formData') formData;
  @Output() onCancel = new EventEmitter();

  documentForm: FormGroup = new FormGroup({});
  checked: boolean = false;
  accountDebit;
  management;

  isInvalidForm = false;
  isSubmitted = false;

  public pendingRequest;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    public documentService: DocumentService,
  ) { 
    this.documentForm = this.fb.group(
      {
        allowDelete:[''],
        check:[''],
        code: [''],
        creditCode: [''],
        debitCode: [''],
        id: [""],
        name: [''],
        nameCreditCode: [''],
        nameDebitCode: [''],
        nextStt:[''],
        stt: [''],
        title:[''],
        userCode:[''],
        userFullName:[''],
        userId: [''],
      }
    )
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.isEdit &&
      this.formData &&
      Object.keys(this.formData).length > 0
    ){
      this.documentForm.setValue({
        allowDelete: this.formData.allowDelete,
        check: this.formData.check,
        id: this.formData.id,
        nextStt: this.formData.nextStt,
        stt: this.formData.stt,
        title: this.formData.title,
        code: this.formData.code,
        name: this.formData.name,
        creditCode: this.formData.creditCode,
        debitCode: this.formData.debitCode,
        nameCreditCode: this.formData.nameCreditCode,
        nameDebitCode: this.formData.nameDebitCode,
        userCode: this.formData.userCode,
        userFullName: this.formData.userFullName,
        userId: this.formData.userId,
        
      })
    }
    else{
      this.documentForm.patchValue({
        stt: this.nextStt
      })
    }
    console.log(this.documentForm);
    

    this.documentForm.controls['stt'].addValidators([
      Validators.required
    ])
    this.documentForm.controls['code'].addValidators([
      Validators.required
    ])

    this.documentService.getAllByDisplayInsert().subscribe((data)=>{
      this.accountDebit = data
    })
    this.documentService.getAllUserActive().subscribe(reponse=>{
      console.log(reponse.data);
      this.management = reponse.data
    })
  }
  isChooseManager(){
    this.checked = !this.checked;
  }
  ngOnInit(): void {
   
    this.checked= false
   
  }

  checkValidValidator(fieldName: string) {
    return ((this.documentForm.controls[fieldName].dirty ||
        this.documentForm.controls[fieldName].touched) &&
        this.documentForm.controls[fieldName].invalid) ||
        (this.isInvalidForm && this.documentForm.controls[fieldName].invalid)
        ? 'ng-invalid ng-dirty'
        : '';
  } 

  Subimt(){
    console.log(this.documentForm);
    this.isSubmitted = true;
    this.isInvalidForm = false;
    if (this.documentForm.invalid) {
        this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(
                this.translateService,
                'info.please_check_again'
            ),
        });
        this.isInvalidForm = true;
        this.isSubmitted = false;
        return;
    }
    console.log('run');
    
    let newData = this.cleanObject(
       AppUtil.cleanObject(this.documentForm.value)
  );
  console.log(newData);
    if (this.isEdit) {
      this.documentService.updateDocument(this.formData.id, newData)
          .subscribe((res) => {
              console.log('res', res);
              this.onCancel.emit({});
          });
    } else {
      this.documentService.createDocument(newData).subscribe((res) => {
          console.log('res', res);
          this.onCancel.emit({});
      });
  }
  }
  cleanObject(data){
    let newData = Object.assign({}, data);
    newData.code=data.code;
    newData.allowDelete = !!data.allowDelete ;
    newData.check= !!data.check;
    newData.creditCode=data.creditCode;
    newData.debitCode=data.debitCode;
    newData.id=parseInt(data.id);
    newData.name=data.name;
    newData.stt=parseInt(data.stt);
    newData.title=data.title;
    newData.userId=parseInt(data.userId);
    delete newData.nextStt;
    delete newData.userFullName;
    delete newData.nameDebitCode;
    delete newData.nameCreditCode;
    delete newData.userCode;
    return newData;
  }
}
