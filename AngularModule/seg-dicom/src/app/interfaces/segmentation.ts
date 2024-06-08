export interface Segmentation {
    id: number;
    seriesInstanceUID: string;
    patientName: string;
    patientSex: string;
    patientBirthDate: Date;
    bodyPart: string;
    dicomUrls: string[]
}