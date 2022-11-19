import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class ProcessFaceService {

  idImage: any;
  imageDescriptors: any = [];
  faceMatcher:any;

  constructor() { }

  async processFace(image:any, id:string){

    //librerias de reconocmiento facial y 
    await faceapi.nets.tinyFaceDetector.loadFromUri ('/assets/models'); // Detector cara
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'); // Detector  puntos cardinales
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'); // Reconocimiento

    const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

    if(typeof detection === 'undefined'){ // Img no encontrada
      return
    }
    
    this.imageDescriptors.push({ 
      id:id,
      detection
    });

   //coincidencia en las imágenes
   this.faceMatcher = new faceapi.FaceMatcher(this.imageDescriptors.map(
     (faceDescriptor:any)=>(
      new faceapi.LabeledFaceDescriptors(
        (faceDescriptor.id).toString(),[faceDescriptor.detection.descriptor]
      )
     )
   ))
  }
  descriptor(detection:any){  
    if(detection){
      const bestMatch = this.faceMatcher.findBestMatch(detection.descriptor)
      this.idImage = bestMatch.label;
      this.imagenEncontrada(this.idImage);
    }

  }
  imagenEncontrada(id:string){ // Img encontrada
    if(id==='unknow'){
      return
    }else{
      console.log('Datos recibidos', id);

      localStorage.setItem('id', id)

      location.href ='/deteccion';

    }
  }
  
}
