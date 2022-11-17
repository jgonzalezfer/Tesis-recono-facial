//Trabajar ts firebase base de dato
export class ImagenesModel{
    
    id?:String;
    nombreImagen: string;
    rut: string;
    imgUrl: string;

    constructor(nombreImagen:string, imgUrl:string, rut:string){
        this.nombreImagen = nombreImagen;
        this.imgUrl = imgUrl;
        this.rut =rut;
    }
}