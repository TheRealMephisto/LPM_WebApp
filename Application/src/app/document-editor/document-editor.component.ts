import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { DataService } from '../data.service';

/**
 * Provide a form enabling the user to edit database entries, i.e. of TeX-Documents.
 */
@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit {

  @Output() finished: EventEmitter<void> = new EventEmitter<void>();

  public informationTypes: Array<string>;

  public informationViewArray: Array<string>;

  fileEnding: string = 'tex'

  constructor(
      private fb: FormBuilder,
      private dataService: DataService
    ) { }

  ngOnInit() {
    this.texDocumentForm.get('author').setValue('devUser');
    this.dataService.getInformationTypes().subscribe(data => { // todo: handle observable inside data.service
      this.informationTypes = this.dataService.JsonToArray(data);
    });
    this.informationViewArray = [];
  }

  public texDocumentForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    path: new FormControl('', [Validators.required, Validators.pattern('.*\.'.concat(this.fileEnding))]),
    author: new FormControl('', [Validators.required]),
    packages: this.fb.array([]),
    files: this.fb.array([]),
    informationArray: this.fb.array([])
  });

  getErrorMessage(target: string): string {
    let targetForm: AbstractControl;
    switch(target) {
      case 'title':
        targetForm = this.texDocumentForm.get('title');
        break;
      case 'path':
        targetForm = this.texDocumentForm.get('path');
        break;
      case 'author':
        targetForm = this.texDocumentForm.get('author');
        break;
      default:
        return;
    }
    if (targetForm.hasError('required')) {
      return 'You must enter a value';
    }
    if (targetForm.hasError('pattern')) {
      return 'Must be a file path ending on .'.concat(this.fileEnding);
    }
  }

  get packages(): FormArray {
    return this.texDocumentForm.get('packages') as FormArray;
  }

  get files(): FormArray {
    return this.texDocumentForm.get('files') as FormArray;
  }

  public addFile(): void {
    this.files.push(this.fb.control(''));
  }

  get informationArray(): FormArray {
    return this.texDocumentForm.get('informationArray') as FormArray;
  }

  public addInformation(): void {
    this.informationArray.push(this.fb.group({
      information: new FormControl(''),
      type: new FormControl('')
    }));
    this.informationViewArray.push("text");
  }

  get packageOptions(): Array<FormArray> {
    let optionsArray: Array<any> = [];
    for (let i = 0; i < this.packages.length; i++) {
      optionsArray.push(this.packages.controls[i].get('options'));
    }
    return optionsArray;
  }

  public addPackage(): void {
    this.packages.push(this.fb.group({
      package: new FormControl(''),
      options: this.fb.array([])
    }));
  }

  public addOption(index: number): void {
    this.packageOptions[index].push(this.fb.control(''));
  }

  public onSubmit(): void {
    this.dataService.addNewTexDocument(this.texDocumentForm.value);
    this.finished.emit();
  }

  public onAbort(): void {
    this.finished.emit();
  }

  public onInformationTypeChanged(value: string, i: number): void {
    if (value == 'creationDate') {
      this.informationViewArray[i] = 'date';
    }
  }

}
