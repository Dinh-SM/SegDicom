import { Component } from '@angular/core';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CaseService } from '../../services/case.service';
import { ToastTypes } from '../../enums/toast-types.enum';
import { RouteLinks } from '../../enums/routes-links.enum';
import { Case } from '../../interfaces/case';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Renderer, parseImage } from 'dicom.ts';
import { take } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-case',
  standalone: true,
  imports: [
    CommonModule,
    DragAndDropDirective,
    ToastComponent,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './create-case.component.html',
  styleUrl: './create-case.component.css'
})
export class CreateCaseComponent {
  case: Case = {
    id: 0,
    name: "",
    description: "",
    creationDate: new Date(),
    lastModificationDate: undefined,
    segmentations: []
  };

  dicoms: File[] = [];

  fileImageUrls: string[] = [];
  acceptedFileTypes = ".dcm,.dicom";
  private acceptedFileTypeArray = this.acceptedFileTypes.replaceAll(".", "").split(',');

  constructor(
      private router: Router,
      private caseService: CaseService
    ) { }

  onNameChange(value: string) {
    this.case.name = value;
  }

  onDescriptionChange(value: string) {
    this.case.description = value;
  }

  onFileDropped($event: any) {
    this.uploadFiles($event);
  }

  onFileBrowsed(target: any) {
    this.uploadFiles(target.files);
  }

  async uploadFiles(files: any[]) {
    SpinnerComponent.activateSpinner();

    Array.from(files).forEach((file: File) => {
      if (!this.acceptedFileTypeArray.find(acceptedFileType =>
          acceptedFileType === file.name.split('.').pop())
        ) {
        ToastComponent.displayToastMessage(ToastTypes.Warning, "CreateCase.NotDicomWarning");
        return;
      }

      if (this.dicoms.find((alreadyUploadedFile: File) => alreadyUploadedFile.name === file.name)) {
        ToastComponent.displayToastMessage(ToastTypes.Warning, "CreateCase.FileAlreadyUploadedWarning");
        return;
      }

      const fileReader = new FileReader();
      var imageFile: string;

      fileReader.onload = async () => {
        const canvas = document.createElement("canvas");
        imageFile = await this.extractImageFromDicom(canvas, new DataView(fileReader.result as ArrayBuffer));

        this.dicoms.push(file);
        this.fileImageUrls.push(imageFile);
      }
      
      fileReader.readAsArrayBuffer(file);
    });

    SpinnerComponent.deactivateSpinner();
  }

  async submitFiles() {
    if (this.dicoms.length === 0 || !this.case.name) {
      return;
    }
    
    SpinnerComponent.activateSpinner();

    this.caseService
      .createCase(this.case, this.dicoms)
      .pipe(take(1))
      .subscribe({
        next: (newCaseId: number) => {
          ToastComponent.displayToastMessage(ToastTypes.Success, "CreateCase.CreationSuccess");
          this.router.navigate([RouteLinks.CasePage, newCaseId ?? 1]);
          SpinnerComponent.deactivateSpinner();
        },
        error: (error: HttpErrorResponse) => {
          if (environment.debug) {
            console.error(error);
          }
          ToastComponent.displayToastMessage(ToastTypes.Error, error.message);
          SpinnerComponent.deactivateSpinner();
        }
      });
  }

  deleteFile(index: number) {
    let fileToDeleteName = this.dicoms[index].name;
    this.dicoms.splice(index, 1);
    this.fileImageUrls.splice(index, 1);
    ToastComponent.displayToastMessage(ToastTypes.Info, "CreateCase.DicomDeletedInfo", {fileName: fileToDeleteName});
  }

  deleteAllFiles() {
    if (this.dicoms.length === 0) {
      return;
    }

    this.dicoms = [];
    this.fileImageUrls = [];
    ToastComponent.displayToastMessage(ToastTypes.Success, "CreateCase.DicomDeletedSuccess");
  }

  private async extractImageFromDicom(canvas: HTMLCanvasElement, buffer: DataView): Promise<string> {
    const image = parseImage(buffer);
    const renderer = new Renderer(canvas);
    await renderer.render(image!, 0);
    return canvas.toDataURL('image/png');
  }
}