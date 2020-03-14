import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';

/**
 * Provide a form enabling the user to edit database entries, i.e. of TeX-Documents.
 */
@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit {

  fileEnding: string = 'tex'

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.texDocumentForm.get('author').setValue('devUser');
    console.log(this.packages.length);
    console.log(this.packages.controls);
    console.log(this.texDocumentForm);
  }

  public texDocumentForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    path: new FormControl('', [Validators.required, Validators.pattern('.*\.'.concat(this.fileEnding))]),
    author: new FormControl('', [Validators.required]),
    packages: this.fb.array([
    ])
  });

  getErrorMessage(target: string): string {
    let targetForm;
    switch(target) {
      case 'title':
        targetForm = this.texDocumentForm.get('author');
        break;
      case 'path':
        targetForm = this.texDocumentForm.get('author');
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

  get packages() {
    return this.texDocumentForm.get('packages') as FormArray;
  }

  get packageOptions(): Array<FormArray> {
    let optionsArray: Array<any> = [];
    for (let i = 0; i < this.packages.length; i++) {
      optionsArray.push(this.packages.controls[i].get('options'));
    }
    return optionsArray;
  }

  public addPackage() {
    this.packages.push(this.fb.group({
      package: new FormControl(''),
      options: this.fb.array([])
    }));
    console.log(this.packages);
  }

  public addOption(index: number) {
    this.packageOptions[index].push(this.fb.control(''));
  }

  public onSubmit() {
    // console.log(this.texDocumentForm.value);
  }

}