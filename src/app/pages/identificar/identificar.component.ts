import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ProcessFaceService } from 'src/app/services/process-face.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-identificar',
  templateUrl: './identificar.component.html',
  styleUrls: ['./identificar.component.css']
})
export class IdentificarComponent implements OnInit {
  imgProcess : any;

  @ViewChild('videoContainer', { static: true }) videoContainer!: ElementRef; // LLammada al html video
  @ViewChild('myCanvas', { static: true }) myCanvas!: ElementRef; // LLammada al html canvas

  imagenes: any[] = [];

  public context!: CanvasRenderingContext2D;

  constructor(private imagenesSvc: ImagenesService, private processSvc:ProcessFaceService,private renderer:Renderer2) { }

  ngOnInit(): void {

  }

  deteccion() { // Activar detección
    this.main();
  }

  removeVideo() { // Desactivar camara

    location.reload();

  }

  main = async () => {
    localStorage.removeItem('id');
    var num:number = 0; 
    // Variables de conección 
    this.context = this.myCanvas.nativeElement.getContext('2d');

    var video = await navigator.mediaDevices.getUserMedia({ video: true });

    //librerias de reconocmiento facial
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'); // Detector cara
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'); // Detector  puntos cardinales
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'); // Reconocimientong

    this.imagesLista();
    // Activar permisos de la camara
    let stream = this.videoContainer.nativeElement;

    stream.srcObject = video;

    const reDraw = async () => {

      this.context.drawImage(stream, 0, 0, 640, 480);

      requestAnimationFrame(reDraw);

    }

    // Activar Reconocmiento facial por Coincidencia de puntos cardinales
    const processFace = async () => {
      const detection = await faceapi.detectSingleFace(this.videoContainer.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()
        
        if (typeof detection === 'undefined') {// Img no encontrada
            console.log('no', detection);
            console.log('termino', num );
            this.noreconocido();
        }
        num ++;
        if(num == 10){
          console.log('termino');
          location.reload();

           let idImagen: any = localStorage.getItem("constUndefined");
           idImagen ++;
           localStorage.setItem("constUndefined", idImagen )

        }
        
        this.processSvc.descriptor(detection);
    }
    setInterval(processFace, 3000);
    requestAnimationFrame(reDraw);
  }

  // Solicitud de las iamgenes de firebase 
  imagesLista() {

    this.imagenesSvc.getImagenes().subscribe((res: any) => {

      this.imagenes = res;

      this.imagenes.forEach((imagen: any) => {

        const imageElement = document.createElement('img');
        imageElement.src = imagen.imgUrl;
        imageElement.crossOrigin = 'anonymous';
        this.processSvc.processFace(imageElement, imagen.id);
      })
    })
  }



  noreconocido(){
    setTimeout(() => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No tienes ninguna similitud con ningún estudiante',
        footer: 'Contacte con un Profesor'
      })

    }, 2000);
  }
}