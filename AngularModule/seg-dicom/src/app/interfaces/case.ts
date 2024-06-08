import { Segmentation } from "./segmentation";

export interface Case {
    id: number;
    name: string;
    description: string;
    creationDate: Date;
    lastModificationDate: Date | undefined;
    segmentations: Segmentation[]
}