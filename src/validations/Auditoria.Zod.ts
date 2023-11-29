import z from "zod"

export const FiltroLogsAuditoriaSchema = z.object({
    //  nombre_tabla: z.string({
    //     invalid_type_error: "Tipo de dato para el numero de requisición es invalido",
    //     required_error: "Seleccione un centro de costo"
    // }),
    // tipo_accion: z.string({
    //     invalid_type_error: "Tipo de dato para el numero de requisición es invalido",
    //     required_error: "Seleccione un centro de costo"
    // }),
    
    inputs: z.string({
        invalid_type_error: "Tipo de dato para filtrar es invalido",
        required_error: "Ingrese un valor a filtrar"
    }),
    // nombre_usuario: z.string({
    //     invalid_type_error: "Tipo de dato para el numero de requisición es invalido",
    //     required_error: "Seleccione un centro de costo"
    // }),


    
    // fecha_inicial: z.string({
    //     invalid_type_error: "Tipo de dato para la fecha inicial es invalido",
    //     required_error: "Seleccione un centro de costo"
    // }),
    // fecha_final: z.string({
    //     invalid_type_error: "Tipo de dato para la fecha final es invalido",
    //     required_error: "Seleccione un centro de costo"
    // })
})