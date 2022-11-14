import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
//libreria de firebase
import * as faceapi from 'face-api.js';
import { ImagenesModel } from 'src/app/models/imagenes.model';
//libreria de formularios
import { FormBuilder, Validators } from '@angular/forms';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  
  imgElement = '';
  imgURL = '../../../assets/img/noimage.jpg';
  imagen : any;
  imagenesData : ImagenesModel[]=[];
  imgProcess : any;
  btnActive = true;
  file : any;

  //Lammada de img y su validacion 
  @ViewChild('imageFile',{static:true}) imageFile!:ElementRef;

  imagenesForm = this.fb.group({
    nombre:['',[Validators.required]],
    imgFile:['']
  })


  constructor(private fb:FormBuilder, private renderer:Renderer2) { }

  ngOnInit(): void {
  }
  //Carga de img General
  slectImage(event:any){

    if(event.target.files.length > 0 ){
      this.file = event.target.files; // llamada del archivo
      const reader = new FileReader();// lectura del archivo
      reader.readAsDataURL(this.file[0]);
      reader.onloadend = (event:any)=>{
         this.imgURL = event.target.result;
         this.imgElement = event.target.result;
         elementImage.src = `${this.imgElement}`;
         
         //carga de img 
         this.imagen ={
          archivo : this.file[0]
         }
         


      }
      this.btnActive = false;

      //Manejo del DOM (html+ css)
      var containerImage =  document.createElement('div');
      var status = document.createElement('p');
      var icon = document.createElement('i');
      var elementImage = document.createElement('img');
  
      containerImage.classList.add('containerImage');
  
      elementImage.crossOrigin = 'anonymous';
  
      icon.classList.add('fa');
      icon.classList.add('fa-3x');
      icon.classList.add('fa-spiner');
      icon.classList.add('fa-pulse');
      
      status.classList.add('status');
  
      status.appendChild(icon);
  
      containerImage.appendChild(status);
  
      this.imgProcess = elementImage;
  
      this.renderer.appendChild(this.imageFile.nativeElement, containerImage);
  
      this.processFace(this.imgProcess, containerImage);
  
    }

  }

//Faceapi.js (Promesas de llamadas) - Reconocmiento del rostro

  processFace = async (image:any, imageContainer:any) => {

    await faceapi.nets.tinyFaceDetector.loadFromUri ('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');

    const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
                  .withFaceLandmarks()
                  .withFaceDescriptor(); //Calculo de descripcion facial
    
        if (typeof detection === 'undefined'){ // Reconocmiento de imagen(si es persona o no)
            
          imageContainer.querySelector('.status').innerText='No se pudo procesar la imagen';
          imageContainer.querySelector('.status').style.color='red';
          setTimeout(() => {
            imageContainer.querySelector('.status').innerText='';
            this.imgURL = '../../../assets/img/noimage.jpg';
            this.imagenesForm.reset();
          }, 2000);
          this.btnActive =false;

        }else{
          imageContainer.querySelector('.status').innerText='Procesando';
          imageContainer.querySelector('.status').style.color='blue';
          setTimeout(() => {
            imageContainer.querySelector('.status').innerText='';
            this.onSubmit();
          }, 4000);

        }

  }

  onSubmit(){

  }

}
