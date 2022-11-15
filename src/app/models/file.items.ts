//Trabajar ts firebase storage y carga de iamgenes
export class FileItems{

    public archivo:File;
    public url?:string;

    constructor(archivo:File){
        this.archivo=archivo;
    }

}