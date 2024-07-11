export interface Campo {
    nombre: string;
    identificador: string;
    tipo: string;   //! textarea-text, input-text, input-number, select
    opciones?: string[]; //! Para los select, no es obligatorio
    seleccionados?: string[]; //! Para los select-multiple, no es obligatorio
    valor?: string; //! Para los text-ReadOnly, no es obligatorio
}