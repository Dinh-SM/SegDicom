import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastComponent } from '../toast/toast.component';
import { CaseService } from '../../services/case.service';
import { ToastTypes } from '../../enums/toast-types.enum';
import { RouteLinks } from '../../enums/routes-links.enum';
import { SegmentationService } from '../../services/segmentation.service';
import { Case } from '../../interfaces/case';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs';
import { Renderer, parseImage } from 'dicom.ts';
import { Segmentation } from '../../interfaces/segmentation';
import { SpinnerComponent } from '../spinner/spinner.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-case-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './case-page.component.html',
  styleUrl: './case-page.component.css'
})
export class CasePageComponent implements OnDestroy {
  RouteLinks = RouteLinks;

  segmentation: any;
  caseId: number = this.activatedRoute.snapshot.params['caseId'];
  case: Case | undefined;
  private caseSegmentationImageUrls: string[][] = [];
  private currentPseudoGifFrames: number[] = [];
  private intervalIds: any[] = [];
  selectedSegmentation: number = -1;
  isInEditMode: boolean = false;
  private readonly editModeOnLabel: string = "CasePage.EditModeOn";
  private readonly editModeOffLabel: string = "CasePage.EditModeOff";
  editModeLabel: string = this.editModeOnLabel;
  private noDescriptionValue: string = "N/A";

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private caseService: CaseService,
      private segmentationService: SegmentationService
  ) {
      SpinnerComponent.activateSpinner();

      this.caseService
        .getCase(this.caseId)
        .pipe(take(1))
        .subscribe({
          next: async (currentCase: any) => {
            this.case = currentCase;
            if (!this.case?.description) {
              document.getElementById("case-description")!.innerText = this.noDescriptionValue;
            }
            await this.initializeGifSimulation();
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

  ngOnDestroy(): void {
    this.intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);
    })
  }

  exportSegmentation() {
    var blobToSegmentation: Segmentation = this.case!.segmentations[this.selectedSegmentation];
    var blobContainerIdPosition = blobToSegmentation!.dicomUrls[0].search("segmentation-");
    const blobConainerIdLength = 12 + 1 + 15 + 1 + 15; // "segmentation" + "-" + 15 of series instance UID + "-" + 15 of base 64 guid without special and uppercase chars
    var blobContainerId: string = blobToSegmentation!.dicomUrls[0].substring(blobContainerIdPosition!, blobContainerIdPosition! + blobConainerIdLength)

    SpinnerComponent.activateSpinner();

    this.segmentationService
      .exportSegmentation(blobContainerId)
      .pipe(take(1))
      .subscribe({
        next: (segmentationZipUrl: any) => {
          window.open(segmentationZipUrl);
          ToastComponent.displayToastMessage(ToastTypes.Success, "CasePage.SegmentationZipGenerated");
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

  activateEditMode() {
    if (!this.isInEditMode) {
      this.isInEditMode = true;
      this.editModeLabel = this.editModeOffLabel;
    } else {
      this.isInEditMode = false;
      this.editModeLabel = this.editModeOnLabel;
      this.resetCaseInfo();
    }
  }

  private resetCaseInfo() {
    document.getElementById("case-name")!.innerText = this.case!.name;
    document.getElementById("case-description")!.innerText = this.case!.description?.length > 0 ? this.case!.description : this.noDescriptionValue;
  }

  isCaseUpdatable(): boolean {
    var newCaseName: string | null | undefined = document.getElementById("case-name")?.innerText.trim();
    var newCaseDescription: string | null | undefined = document.getElementById("case-description")?.innerText.trim();
    return ((newCaseName !== this.case?.name.trim()) || (newCaseDescription !== this.case?.description?.trim())) && newCaseName!.length > 0;
  }

  updateCase() {
    var newCaseName: string | null | undefined = document.getElementById("case-name")!.innerText.trim();
    var newCaseDescription: string | null | undefined = document.getElementById("case-description")!.innerText.trim();

    if (!newCaseDescription) {
      document.getElementById("case-description")!.innerText = this.noDescriptionValue;
    }

    var editedCase: Case = {
      id: this.case!.id,
      name: newCaseName!,
      description: newCaseDescription!,
      creationDate: this.case!.creationDate,
      lastModificationDate: new Date(),
      segmentations: this.case!.segmentations
    }

    SpinnerComponent.activateSpinner();

    this.caseService
      .updateCase(editedCase)
      .pipe(take(1))
      .subscribe({
        next: () => {
          ToastComponent.displayToastMessage(ToastTypes.Success, "CasePage.UpdateSuccess");
          SpinnerComponent.deactivateSpinner();
          this.reloadCurrentRoute();
        },
        error: (error: HttpErrorResponse) => {
          if (environment.debug) {
            console.error(error);
          }
          ToastComponent.displayToastMessage(ToastTypes.Error, error.message);
          SpinnerComponent.deactivateSpinner();
        }
      })
  }

  deleteCase() {
    SpinnerComponent.activateSpinner();

    this.caseService
      .deleteCase(this.caseId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(["/", RouteLinks.Home]);
          ToastComponent.displayToastMessage(ToastTypes.Success, "CasePage.DeletionSuccess");
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

  private async initializeGifSimulation() {
    this.caseSegmentationImageUrls = await this.getCaseSegmentationImageUrls();
    this.currentPseudoGifFrames = new Array(this.case?.segmentations.length).fill(0);
    this.case?.segmentations.forEach((segmentation, index) => {
      let newIntervalId = setInterval(() => {
        this.simulateGif(index)
      }, 80);

      this.intervalIds.push(newIntervalId);
    })
  }

  private async getCaseSegmentationImageUrls(): Promise<string[][]> {
    var caseSegmentationImageUrls: string[][] = [];

    this.case?.segmentations.forEach(async (segmentation) => {
      var segmentationImageUrls: any[] = new Array(segmentation.dicomUrls.length).fill(0);

      segmentation.dicomUrls.forEach(async (dicomUrl, index) => {
        let file = await fetch(dicomUrl).then(r => r.blob());

        const fileReader = new FileReader();
        var imageFile: string;

        fileReader.onload = async () => {
          const canvas = document.createElement("canvas");
          imageFile = await this.extractImageFromDicom(canvas, new DataView(fileReader.result as ArrayBuffer));

          segmentationImageUrls[index] = imageFile;
        }

        fileReader.readAsArrayBuffer(file);
      })

      caseSegmentationImageUrls.push(segmentationImageUrls);
    })

    SpinnerComponent.deactivateSpinner();
    return caseSegmentationImageUrls;
  }

  private async extractImageFromDicom(canvas: HTMLCanvasElement, buffer: DataView): Promise<string> {
    const image = parseImage(buffer);
    const renderer = new Renderer(canvas);
    await renderer.render(image!, 0);
    return canvas.toDataURL('image/png');
  }

  private simulateGif(id: number): void {
    var pseudoGif: HTMLImageElement | null = document.getElementById(`case-segmentation-gif-${id}`) as HTMLImageElement;
    if (pseudoGif) {
      pseudoGif.src = this.caseSegmentationImageUrls[id][this.currentPseudoGifFrames[id]];
      this.currentPseudoGifFrames[id]++;
      if (this.case?.segmentations[id] &&
          this.currentPseudoGifFrames[id] >= this.caseSegmentationImageUrls[id].length) {
        this.currentPseudoGifFrames[id] = 0;
      }
    }
  }

  selectSegmentation(i: number) {
    var selectedClass: string = "selected";
    var caseSegmentationElement: HTMLElement | null = document.getElementById(`case-segmentation-${i}`);

    if(caseSegmentationElement?.classList.contains(selectedClass)) {
      caseSegmentationElement?.classList.remove(selectedClass);
      this.selectedSegmentation = -1;
    } else {
      caseSegmentationElement?.classList.add(selectedClass);
      for (let segmentationId in Array.from(Array(this.case?.segmentations.length).keys())) {
        if (segmentationId !== i.toString()) {
          document.getElementById(`case-segmentation-${segmentationId}`)?.classList.remove(selectedClass);
        }
      }
      this.selectedSegmentation = i;
    }
  }

  private reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    var exportSegmentationButtonId: string = "export-segmentation-button";
    var selectedClass: string = "selected";
    if (!event.target.id ||
        event.target.id && event.target.id !== exportSegmentationButtonId && !event.target.id?.startsWith("case-segmentation-")) {
      for (let segmentationId in Array.from(Array(this.case?.segmentations.length).keys())) {
        document.getElementById(`case-segmentation-${segmentationId}`)?.classList.remove(selectedClass);
      }
      this.selectedSegmentation = -1;
    }    
  }
}