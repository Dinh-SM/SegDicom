# imports
from io import BytesIO
import logging
import azure.functions as func
from azure.storage.blob import BlobServiceClient
import numpy as np
import copy
from math import *
from functools import reduce
from glob import glob
import pydicom
from skimage import measure
import imageio
import os
import pathlib
import shutil



# azure things
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.function_name(name="Segment")
@app.route(route="segment")
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Segment: Activated")
    containerId = req.params.get("blobContainerId")
    if not containerId:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            containerId = req_body.get("blobContainerId")

    if containerId:
        dicoms = get_blob_data(containerId)
        
        if isinstance(dicoms, str):
            return func.HttpResponse(dicoms)
        
        segmentUrl = segmentAndZip(containerId, dicoms)
        return func.HttpResponse(segmentUrl)
    
    return func.HttpResponse(
             "Wtf",
             status_code=500
        )

def get_blob_data(containerId):
    connection_string = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(containerId)
    
    dicoms = []

    try:
        for blob in container_client.list_blobs():
            if blob.name.endswith(".dcm"):
                blob_client = container_client.get_blob_client(blob.name)
                blob_stream = BytesIO()
                blob_client.download_blob().download_to_stream(blob_stream)
                blob_stream.seek(0)
                dicom_data = pydicom.dcmread(blob_stream)
                dicoms.append(dicom_data)
            elif blob.name.endswith(".zip"):
                blob_client = container_client.get_blob_client(blob.name)
                return blob_client.url + ""

        return dicoms
    except Exception as e:
        return func.HttpResponse(
                e + " wtf",
                status_code=500
            )

def upload_blob_file(containerId, fileToUpload):
    connection_string = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(containerId)
    
    with open(fileToUpload, mode="rb") as data:
        blob_client = container_client.upload_blob(name=f"{containerId}.zip", data=data, overwrite=True)
        
    return blob_client
        


# function definitions
def load_scan(dicoms):
    slices = dicoms
    slices.sort(key = lambda x: int(x.InstanceNumber), reverse = True)
    try:
        slice_thickness = np.abs(slices[0].ImagePositionPatient[2] - slices[1].ImagePositionPatient[2])
    except:
        slice_thickness = np.abs(slices[0].SliceLocation - slices[1].SliceLocation)
        
    for s in slices:
        s.SliceThickness = slice_thickness
        
    return slices

def get_pixels_hu(scans):
    image = np.stack([s.pixel_array for s in scans])
    image = image.astype(np.int16)
    image[image == -2000] = 0
    
    intercept = scans[0].RescaleIntercept
    slope = scans[0].RescaleSlope
    
    if slope != 1:
        image = slope * image.astype(np.float64)
        image = image.astype(np.int16)
        
    image += np.int16(intercept)
    
    return np.array(image, dtype=np.int16)

def largest_label_volume(im, bg=-1):
    vals, counts = np.unique(im, return_counts=True)
    counts = counts[vals != bg]
    vals = vals[vals != bg]
    if len(counts) > 0:
        return vals[np.argmax(counts)]
    else:
        return None
    
def segment_lung_mask(image, fill_lung_structures=True):
    binary_image = np.array(image >= -700, dtype=np.int8)+1
    labels = measure.label(binary_image)
    
    background_label = labels[0,0,0]
 
    binary_image[background_label == labels] = 2
 
    if fill_lung_structures:
        for i, axial_slice in enumerate(binary_image):
            axial_slice = axial_slice - 1
            labeling = measure.label(axial_slice)
            l_max = largest_label_volume(labeling, bg=0)
 
            if l_max is not None:
                binary_image[i][labeling != l_max] = 1
    binary_image -= 1
    binary_image = 1-binary_image
 
    labels = measure.label(binary_image, background=0)
    l_max = largest_label_volume(labels, bg=0)
    if l_max is not None:
        binary_image[labels != l_max] = 0
 
    return binary_image

def transformImagePixelRange(imageArray):
    return np.array((((imageArray - imageArray.min()) / (imageArray.max() - imageArray.min())) * 255), dtype=np.int16)



# main code
def segmentAndZip(containerId, dicoms):
    logging.info("Load dicoms")
    patient_dicom = load_scan(dicoms)
    patient_pixels = get_pixels_hu(patient_dicom)

    logging.info("Segment dicoms")
    segmented_lungs_fill = segment_lung_mask(patient_pixels, fill_lung_structures=True)

    copied_pixels = copy.deepcopy(patient_pixels)
    for i, mask in enumerate(segmented_lungs_fill): 
        get_high_vals = mask == 0
        copied_pixels[i][get_high_vals] = 0
    seg_lung_pixels = copied_pixels

    savePath = pathlib.Path(__file__).parent.resolve()

    logging.info("Create segmentation folders")
    os.mkdir(f"{savePath}/{containerId}")
    os.mkdir(f"{savePath}/{containerId}/mask")
    os.mkdir(f"{savePath}/{containerId}/segmentation")

    logging.info("Transform segmentation pixel range")
    transformed_segmented_lungs_fill = transformImagePixelRange(segmented_lungs_fill)
    transformed_seg_lung_pixels = transformImagePixelRange(seg_lung_pixels)

    logging.info("Save segmentation gifs")
    imageio.mimsave(f"{savePath}/{containerId}/{containerId}_mask.gif", transformed_segmented_lungs_fill, "gif", duration=0.1)
    imageio.mimsave(f"{savePath}/{containerId}/{containerId}_segmentation.gif", transformed_seg_lung_pixels, "gif", duration=0.1)

    logging.info("Save segmentation images")
    slice = 0
    for transformed_segmented_lung_fill in transformed_segmented_lungs_fill:
        imageio.imwrite(f"{savePath}/{containerId}/mask/{containerId}_mask_slice_{slice}.jpg", transformed_segmented_lung_fill.astype(np.uint8), "jpg")
        slice += 1
        
    slice = 0
    for transformed_seg_lung_pixel in transformed_seg_lung_pixels:
        imageio.imwrite(f"{savePath}/{containerId}/segmentation/{containerId}_segmentation_slice_{slice}.jpg", transformed_seg_lung_pixel.astype(np.uint8), "jpg")
        slice += 1
    
    logging.info("Create segmentation zip")
    shutil.make_archive(f"{savePath}/{containerId}", "zip", f"{savePath}/{containerId}")
    shutil.rmtree(f"{savePath}/{containerId}")
    
    logging.info("Upload segmentation zip")
    blob_client = upload_blob_file(containerId, f"{savePath}/{containerId}.zip")
    os.remove(f"{savePath}/{containerId}.zip")
    
    logging.info("Response")
    return blob_client.url