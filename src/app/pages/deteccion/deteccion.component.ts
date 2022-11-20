import { Component, OnInit } from '@angular/core';
import { ImagenesService } from 'src/app/services/imagenes.service';

@Component({
  selector: 'app-deteccion',
  templateUrl: './deteccion.component.html',
  styleUrls: ['./deteccion.component.css']
})
export class DeteccionComponent implements OnInit {

  //Variables
  idImagen:any;
  imagenData:any;
  imgNombre:any;
  imgFoto:any;
  asignatura:any;
  rut:any;
  carrera:any;

  constructor(private imagenesSvc:ImagenesService) { }

  ngOnInit() {
    this.obtenerImg();
  }

// Obtener la Id que está almacenada en caché y obtener los datos del estudiante por la id
  obtenerImg(){
    this.idImagen = localStorage.getItem('id');
    this.imagenesSvc.getImagen(this.idImagen).subscribe(res=>{
        this.imagenData = res;
        this.imgNombre = this.imagenData.nombreImagen;
        this.imgFoto = this.imagenData.imgUrl;
        this.asignatura = this.imagenData.asignatura;
        this.rut =this.imagenData.rut;
        this.carrera =this.imagenData.carrera;
    })
  }

  volver(){
    localStorage.removeItem('id');
    location.href = '/identificar';
  }
}