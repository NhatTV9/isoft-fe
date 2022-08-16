export interface DocumentModel {
    id: number;
    stt: number;
    code: string;
    name: string;
    debitCode: string;
    nameDebitCode: string;
    creditCode: string;
    nameCreditCode: string;
    allowDelete: boolean;
    check: boolean;
    userId: string;
    userCode: string;//
    userFullName: string;//
    nextStt: number;//
    title: string;
}
