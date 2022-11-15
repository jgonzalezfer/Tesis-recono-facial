// Ts de servicios img 
import { Injectable } from '@angular/core';

import { AngularFirestore,AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { ImagenesModel } from "../models/imagenes.model";
import { FileItems } from "../models/file.items";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import  Swal  from "sweetalert2";


@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  // Variables
  private CARPETA_IMAGENES = 'imagenes'; //Llamada de nombre archivo

  private imagenesCollection : AngularFirestoreCollection<ImagenesModel>

  progress:any;

  constructor(private db:AngularFirestore) {

    this.imagenesCollection = db.collection<ImagenesModel>('imagenes');

   }
   getImagenes(){ //Llamada de la img

   } 
   cargarImagenesFirebase(imagen:FileItems, imagesData:ImagenesModel){ //Carga de img

    const storage = getStorage();
    let item = imagen;

    //Borar espacios en el nombre
    let imagenTrim = imagesData.nombreImagen;
    const storageRef = ref(storage, `${this.CARPETA_IMAGENES}/${imagenTrim.replace(/ /g, '')}`);

    const uploadTask = uploadBytesResumable(storageRef,item.archivo); //Tarea de la carga de img

    uploadTask.on('state_changed', (snapshot)=>{
      this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //Barra de progreso
      console.log(this.progress);
    },(err) =>{
      console.log('Error al subir archivo', err);
   },()=>
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{ //carga del archivo y controlando la referencia, ademas sus promesas
      item.url = downloadURL;
      //guardar img
      this.guardarImagen({
        nombreImagen:imagesData.nombreImagen,
        imgUrl:item.url
      });
    })
   )
   }
   async guardarImagen(imagen:{nombreImagen:string, imgUrl:string}):Promise<any>{ //Guardar img

    try{

      return await this.db.collection('imagenes').add(imagen); // llamda de imagen y añadir a db

    } catch(err){

      console.log(err);

    }

   }

}