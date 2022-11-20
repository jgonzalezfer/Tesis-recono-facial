//Trabajar ts firebase base de dato
export class ImagenesModel{
    
    id?:String;
    nombreImagen: string;
    rut: string;
    carrera:string;
    asignatura:string;
    imgUrl: string;

    constructor(nombreImagen:string, imgUrl:string, rut:string, carrera:string, asignatura:string){
        this.nombreImagen = nombreImagen;
        this.imgUrl = imgUrl;
        this.rut =rut;
        this.asignatura=asignatura;
        this.carrera =carrera;
    }
}