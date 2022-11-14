//Trabajar ts firebase base de dato
export class ImagenesModel{
    
    id?:String;
    nombreImagen: string;
    imgUrl: string;

    constructor(nombreImagen:string, imgUrl:string){
        this.nombreImagen = nombreImagen;
        this.imgUrl = imgUrl;
    }
}