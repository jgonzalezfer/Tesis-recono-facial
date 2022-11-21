// Ts de subida de datos general
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
//libreria de firebase
import * as faceapi from 'face-api.js';
import { ImagenesModel } from 'src/app/models/imagenes.model';
//libreria de formularios
import { FormBuilder, Validators } from '@angular/forms';
import { async } from '@angular/core/testing';
import Swal from 'sweetalert2';
import { ImagenesService } from 'src/app/services/imagenes.service';

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


  constructor(private fb:FormBuilder, private renderer:Renderer2, private imagenesSvc: ImagenesService) { }

  ngOnInit(): void {
    this.mostrarImg()
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
      this.btnActive = false; // boton "enviar" desactivado

      //Manejo del DOM (html+ css)
      var containerImage =  document.createElement('div');
      var status = document.createElement('p');
      var icon = document.createElement('i');
      var elementImage = document.createElement('img');
  
      containerImage.classList.add('containerImage');
  
      elementImage.crossOrigin = 'anonymous';
  
      icon.classList.add('fa');
      icon.classList.add('fa-3x');
      icon.classList.add('fa-spinner');
      icon.classList.add('fa-pulse');
      
      status.classList.add('status');
  
      status.appendChild(icon);
  
      containerImage.appendChild(status);
  
      this.imgProcess = elementImage;
  
      this.renderer.appendChild(this.imageFile.nativeElement, containerImage);
  
      this.processFace(this.imgProcess, containerImage);  
    }
  }

  processFace = async (image:any, imageContainer:any) => { //Faceapi.js (Promesas de llamadas) - Reconocmiento del rostro

    await faceapi.nets.tinyFaceDetector.loadFromUri ('/assets/models'); // Detector cara
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'); // Detector  puntos cardinales
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'); // Reconocimiento

    const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()) // buscar una cara
                  .withFaceLandmarks()
                  .withFaceDescriptor(); // Calculo de descripcion facial
    
        if (typeof detection === 'undefined'){ // Reconocmiento de imagen(si es persona o no)
            
          imageContainer.querySelector('.status').innerText='Persona no detectada';
          imageContainer.querySelector('.status').style.color='red';
          setTimeout(() => {
            imageContainer.querySelector('.status').innerText='';
            this.imgURL = '../../../assets/img/noimage.jpg';
            this.imagenesForm.reset();
          }, 2000);
          this.btnActive = false;
        }else{
          imageContainer.querySelector('.status').innerText='Persona si detectada';
          imageContainer.querySelector('.status').style.color='#ffffff';
          setTimeout(() => {
            imageContainer.querySelector('.status').innerText='';
            this.onSubmit();
          }, 4000);

        }
  }

  async onSubmit(){ // activación de envio de datos del Estudiante 
    
  await Swal.fire({// Pop-up De datos 
      title:'Introducir los datos del Estudiante',
      html: `
      <input type="text" id="swal-input1" style="width: 350px !important;" class="swal2-input" placeholder="Ingrese Nombre y Apelliado">
      <input type="text" id="swal-input2" style="width: 350px !important;" class="swal2-input" placeholder="Ingrese RUT">
      <input type="text" id="swal-input3" style="width: 350px !important;" class="swal2-input" placeholder="Ingrese Carrea">
      <input type="text" id="swal-input4" style="width: 350px !important;" class="swal2-input" placeholder="Ingrese Asignatura">`,
      preConfirm: () => {
        const nombreImagen = (document.getElementById('swal-input1')as HTMLInputElement | null)?.value
        const rut = (document.getElementById('swal-input2')as HTMLInputElement | null)?.value
        const carrera = (document.getElementById('swal-input3')as HTMLInputElement | null)?.value
        const asignatura = (document.getElementById('swal-input4')as HTMLInputElement | null)?.value
        return { nombreImagen:nombreImagen, rut:rut, carrera:carrera, asignatura:asignatura }
      },
      icon: 'info',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton:true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Salir',
      allowOutsideClick: false
    }).then((result)=>{
      console.log('datos', result);
      if (result.isConfirmed && result.value){
        let cargarImagenDatos: any = {
          nombreImagen:result.value.nombreImagen,
          rut:result.value.rut,
          carrera:result.value.carrera,
          asignatura:result.value.asignatura
        }
        this.imagenesSvc.cargarImagenesFirebase(this.imagen, cargarImagenDatos);
        Swal.fire({
          icon:'success',
          title:'Datos Guardados',
          text:'En breve aparecera la imagen cargada y sus datos'
        }).then((result)=>{
          if (result){
            this.imgURL = '../../../assets/img/noimage.jpg';
            this.imagenesForm.reset();
          }
        })
      }else{
        // si no tiene datos
        if (!result.isConfirmed && !result.value){
          location.reload();
        }else{
          Swal.fire({
            icon:'error',
            title:'Error',
            text:'Debe llenar los cammpos',
            confirmButtonText:'OK'
          }).then((result)=>{
            this.imagenesForm.reset();
          })
        }
      }
    });
  }

  mostrarImg(){ //mostrar img en la tabla

    this.imagenesSvc.getImagenes().subscribe(res=>{

      this.imagenesData = [];
      res.forEach((element:ImagenesModel)=>{
        this.imagenesData.push({
          ...element
        })
      })
    })
  }

  eliminar(id:any, nombreImagen:string){ // Eliminar estudiante
    this.imagenesSvc.delateimg(id, nombreImagen);
  }

  async actualizaDatos(id:any, nombreImagen:any, rut:any, carrera:any, asignatura:any, img:any){ // Pop-up De actualizar datos 
    console.log('id', id )
    await Swal.fire({
      title:'Introducir los datos del Estudiante para actualizar',
      html: 
      `<img alt="" width="100" src="` + img + `">`+
      `<input type="text" id="swal-input1" style="width: 350px !important;" class="swal2-input" placeholder="Ingrese Nombre y Apelliado" value="`+ nombreImagen + `">`+ 
      `<input type="text" id="swal-input2" style="width: 350px !important;" class="swal2-input" placeholder="Ingrese Rut" value="` + rut + `">`+
      `<input type="text" id="swal-input3" style="width: 350px !important;" class="swal2-input" placeholder="Ingrese Carrera" value="` + carrera + `">`+
      `<input type="text" id="swal-input4" style="width: 350px !important;" class="swal2-input" placeholder="Ingrese Asignatura" value="` + asignatura + `">`,
      preConfirm: (id:any) => {
        const ids = id
        const nombreImagen = (document.getElementById('swal-input1') as HTMLInputElement | null )?.value 
        const rut = (document.getElementById('swal-input2') as HTMLInputElement | null)?.value
        const carrera = (document.getElementById('swal-input3') as HTMLInputElement | null)?.value
        const asignatura = (document.getElementById('swal-input4') as HTMLInputElement | null)?.value
        return { nombreImagen:nombreImagen, rut:rut, carrera:carrera, asignatura:asignatura, id:ids }
      },
      icon: 'info',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton:true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Salir',
      allowOutsideClick: false
    }).then((result)=>{
      console.log('datos', result);
      if (result.isConfirmed && result.value){
        let cargarImagenDatos: any = {
          nombreImagen:result.value.nombreImagen,
          rut:result.value.rut,
          carrera:result.value.carrera,
          asignatura:result.value.asignatura
        }
        this.imagenesSvc.actualizarDatos(cargarImagenDatos, id);
        Swal.fire({
          icon:'success',
          title:'Datos cargados',
          text:'En breve aparecera los datos del estudiante actualizados'
        }).then((result)=>{
          if (result){
            this.imgURL = '../../../assets/img/noimage.jpg';
            this.imagenesForm.reset();
          }
        })
      }else{
        // si no tiene datos
        if (!result.isConfirmed && !result.value){
          location.reload();
        }else{
          Swal.fire({
            icon:'error',
            title:'Error',
            text:'Debe llenar los cammpos',
            confirmButtonText:'OK'
          }).then((result)=>{
            this.imagenesForm.reset();
          });
        }
      }
    });
  }

}
