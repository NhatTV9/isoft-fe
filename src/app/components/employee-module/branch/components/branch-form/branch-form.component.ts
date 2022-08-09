import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {BranchService} from 'src/app/service/branch.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import {HttpErrorResponse} from "@angular/common/http";


@Component({
    selector: 'app-branch-form',
    templateUrl: './branch-form.component.html',
    styles: [
        `
        `,
    ],
})
export class BranchFormComponent implements OnInit, OnChanges {
    public appConstant = AppConstant;
    @Input('formData') formData: any = {};
    @Input('isReset') isReset: boolean = false;
    @Input('isEdit') isEdit: boolean = false;
    @Input('display') display: boolean = false;
    @Output() onCancel = new EventEmitter();
    title: string = '';

    branchForm: FormGroup = new FormGroup({});

    isSubmitted = false;
    isInvalidForm = false;
    failPassword: boolean = false;

    constructor(
        private fb: FormBuilder,
        private translateService: TranslateService,
        private messageService: MessageService,
        private branchService: BranchService
    ) {
        this.branchForm = this.fb.group(
            {
                id: [''],
                code: ['', [Validators.required]],
                name: ['', [Validators.required]],
                managerName: ['', [Validators.required]]
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            this.isEdit &&
            this.formData &&
            Object.keys(this.formData).length > 0
        ) {
            this.title = AppUtil.translate(this.translateService, 'label.edit_branch');
            this.branchForm.setValue({
                id: this.formData.id,
                code: this.formData.code,
                name: this.formData.name,
                managerName: this.formData.managerName,
            });
            console.log('this.branchForm', this.branchForm)
        } else {
            this.title = AppUtil.translate(this.translateService, 'label.add_branch');
        }
    }

    onReset() {
        this.isInvalidForm = false;
        this.branchForm.reset();
    }

    ngOnInit() {
    }

    checkValidValidator(fieldName: string) {
        return ((this.branchForm.controls[fieldName].dirty ||
                this.branchForm.controls[fieldName].touched) &&
            this.branchForm.controls[fieldName].invalid) ||
        (this.isInvalidForm &&
            this.branchForm.controls[fieldName].invalid)
            ? 'ng-invalid ng-dirty'
            : '';
    }

    checkValidMultiValidator(fieldNames: string[]) {
        for (let i = 0; i < fieldNames.length; i++) {
            if (
                ((this.branchForm.controls[fieldNames[i]].dirty ||
                        this.branchForm.controls[fieldNames[i]].touched) &&
                    this.branchForm.controls[fieldNames[i]].invalid) ||
                (this.isInvalidForm &&
                    this.branchForm.controls[fieldNames[i]].invalid)
            ) {
                return true;
            }
        }
        return false;
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isInvalidForm = false;
        if (this.branchForm.invalid) {
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

        let newData = this.cleanObject(
            AppUtil.cleanObject(this.branchForm.value)
        );
        // this.onCancel.emit({});
        if (this.isEdit) {
            this.branchService
                .updateBranch(newData, this.formData.id)
                .subscribe((res: any) => {
                    if (res?.status === 400) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Thông báo',
                            detail: res?.error?.msg || ''
                        })
                        return
                    }
                    this.onCancel.emit({});
                });
        } else {
            this.branchService.createBranch(newData).subscribe((res: any) => {
                if (res?.code === 400) {
                    this.messageService.add({severity: 'error', summary: 'Thông báo', detail: res?.msg || ''})
                    return
                }else{
                    this.onCancel.emit({});
                }
            }, err => {
                console.log('err', err)
            });
        }
    }

    cleanObject(data) {
        let newData = Object.assign({}, data);
        if (!(newData.id > 0)) {
            newData.id = 0;
        }
        return newData;
    }
}