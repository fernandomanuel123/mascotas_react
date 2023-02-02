import React, {useEffect, useState} from 'react'
import axios from 'axios';
import swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from '../functions';
import './Mascotas.css';
import { Input } from 'react';


const ShowMascotas = () => {

    var url = 'http://localhost:5000/mascotas'
    const [mascotas, setMascotas] = useState([]);

    const [idMascota,setIdMascota] = useState('')
    const [nombre,setNombre] = useState('')
    const [tipoAnimal,setTipoAnimal] = useState('')
    const [raza,setRaza] = useState('')
    const [nombreDuenio,setNombreDuenio] = useState('')
    const [dniDuenio,setDniduenio] = useState('')
    const [celularDuenio,setCelularDuenio] = useState('')

    const [showNombreError, setShowNombreError] = useState(false);
    const [showTipoAnimalError, setShowTipoAnimalError] = useState(false);
    const [showRazaError, setShowRazaError] = useState(false);
    const [showNombreDuenioError, setShowNombreDuenioError] = useState(false);
    const [showDniDuenioError, setShowDniDuenioError] = useState(false);
    const [showCelularDuenioError, setShowCelularDuenioError] = useState(false);

    const [operation,setOperation] = useState(1);
    const [title,setTitle] = useState('');
    
    useEffect(()=>{
        getMascotas();
    },[]);

    const getMascotas = async () => {
        const respuesta = await axios.get(url);
        setMascotas(respuesta.data.mascotas);
    }

    useEffect(()=>{
        if (!mascotas) {
            getMascotas();
          }        
    },[mascotas]);


    const openModal = ( op,id,nombre,tipoAnimal,raza,nombreDuenio,dniDuenio,celularDuenio) =>{
        setIdMascota('')
        setNombre('')
        setTipoAnimal('')
        setRaza('')
        setNombreDuenio('')
        setDniduenio('')
        setCelularDuenio('')
        setOperation(op);
        if(op == 1){
            setTitle("Registrar producto")
        }
        else{
            setTitle('Editar producto')
            setIdMascota(id)
            setNombre(nombre)
            setTipoAnimal(tipoAnimal)
            setRaza(raza)
            setNombreDuenio(nombreDuenio)
            setDniduenio(dniDuenio)
            setCelularDuenio(celularDuenio)
        }

        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500)
       
    }

    const validar = () => {
        setShowNombreError(false)
        setShowRazaError(false)
        setShowNombreDuenioError(false)
        setShowDniDuenioError(false)
        setShowCelularDuenioError(false)
        var parametros;
        var metodo;
        if(nombre.trim() === ''){
            setShowNombreError(true)
        }
        else if(tipoAnimal.trim() === ''){
            setShowTipoAnimalError(true)
        }
        else if(raza.trim() === ''){
            setShowRazaError(true)
        }
        else if(nombreDuenio.trim() === ''){
            setShowNombreDuenioError(true)
        }
        else if(dniDuenio.trim() === ''){
            setShowDniDuenioError(true)
        }
        else if(celularDuenio === ''){
            setShowCelularDuenioError(true)
        }
        else{
            if(operation == 1){
                parametros = {nombre: nombre.trim(),tipoAnimal: tipoAnimal.trim(), raza: raza.trim(),nombreDuenio: nombreDuenio.trim(), dniDuenio: dniDuenio.trim(), celularDuenio: celularDuenio}
                metodo = 'POST'
                url = url + '/create'
            }
            else{
                parametros = {nombre: nombre.trim(),tipoAnimal: tipoAnimal.trim(), raza: raza.trim(),nombreDuenio: nombreDuenio.trim(), dniDuenio: dniDuenio.trim(), celularDuenio: celularDuenio}
                metodo = "PUT";
                url = url+'/'+ idMascota
            }
            enviarSolicitud(metodo,parametros, url);
        }        
    }

    const enviarSolicitud = async (metodo, parametros, url) => {
        await axios({ method: metodo, url: url, data: parametros }).then(function(respuesta) {     
          if (respuesta.status === 200) {
            show_alerta(respuesta.data.message, 'success');
            document.getElementById('btnCerrar').click();
            getMascotas();
          }
        })
        .catch(function(error){
            show_alerta(error.response.data.message, 'error')
        });
      };

    const deleteMascota = (id,nombre) => {
        const Myswal = withReactContent(swal);
        Myswal.fire({
            title: '¿Seguro que quiere eliminar a la mascota ' + nombre + ' ?',
            icon: 'question', text: 'No se podrá dar marcha atrás',
            showCancelButton: true, confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'            
        }).then((result)=>{
            if(result.isConfirmed){
            setIdMascota(id)
            url = url +'/' + id
            enviarSolicitud('DELETE',idMascota, url);
            }
            else{
                show_alerta('La mascota no fue eliminada', 'info')
            }  
        });
    }
    


  return (  
    <div className='App'>
        <div className='container-fluid'>
        <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=>openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target= '#modalMascotas'>
                            <i className='fa-solid fa-circle-plus'>                               
                            </i>
                            Agregar mascota
                        </button>
                    </div>
                </div>
            </div>

            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Tipo de animal</th>
                                    <th>Raza</th>
                                    <th>Nombre del dueño</th>
                                    <th>Dni del dueño</th>
                                    <th>Celular del dueño</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {
                                    mascotas && mascotas.map((mascota,i)=>(
                                        <tr key = {i}>
                                            <td>{mascota._id}</td>
                                            <td>{mascota.nombre}</td>
                                            <td>{mascota.tipoAnimal}</td>
                                            <td>{mascota.raza}</td>
                                            <td>{mascota.nombreDuenio}</td>
                                            <td>{mascota.dniDuenio}</td>
                                            <td>{mascota.celularDuenio}</td>
                                            <td>
                                                <button onClick={()=>openModal(2,mascota._id,mascota.nombre,mascota.tipoAnimal,mascota.raza,mascota.nombreDuenio,mascota.dniDuenio,mascota.celularDuenio)}
                                                className='btn btn-warning' data-bs-toggle = 'modal' data-bs-target = '#modalMascotas'>
                                                    <i className='fa-solid fa-edit'></i>                                                    
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteMascota(mascota._id,mascota.nombre)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>                                                
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div id= 'modalMascotas' className='modal fade Modal' aria-hidden= 'true' >
            <div className='modal-dialog'></div>
                <div className='modal-content'></div>
                    <div className='modal-header'>
                        <label className='h2'>{title}</label>
                        <button type= 'button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div>
                            <span className='title'>Nombre</span>
                                <input className={`form-control ${showNombreError == true ? 'error-border' : ''}`} id= 'nombre' placeholder='Nombre' value = {nombre}
                                    onChange={(e)=>setNombre(e.target.value)}>
                                </input>               
                        </div>
                        <span className={` ${showNombreError == true ? 'error-message' : 'hide-message'}`} >El nombre es requerido</span>
                        
                        <div>
                            <span className='title'>Tipo de animal</span>
                                <input className={`form-control ${showTipoAnimalError == true ? 'error-border' : ''}`} id= 'tipoAnimal' placeholder='Tipo del animal' value = {tipoAnimal}
                                    onChange={(e)=>setTipoAnimal(e.target.value)}>
                                </input>               
                        </div>
                        <span className={`${showTipoAnimalError == true ? 'error-message' : 'hide-message'}`} >El tipo de animal es requerido</span>

                        <div>
                            <span className='title'>Raza del animal</span>
                                <input className={`form-control ${showRazaError == true ? 'error-border' : ''}`} id= 'raza' placeholder='Raza del animal' value = {raza}
                                    onChange={(e)=>setRaza(e.target.value)}>
                                </input>               
                        </div>
                        <span className={`${showRazaError == true ? 'error-message' : 'hide-message'}`} >La raza del animal es requerida</span>

                        <div>
                            <span className='title'>Nombre del dueño</span>
                                <input className={`form-control ${showNombreDuenioError == true ? 'error-border' : ''}`} id= 'nombreDuenio' placeholder='Nombre del dueño' value = {nombreDuenio}
                                    onChange={(e)=>setNombreDuenio(e.target.value)}>
                                </input>               
                        </div>
                        <span className={`${showNombreDuenioError == true ? 'error-message' : 'hide-message'}`} >El nombre del dueño es requerido</span>

                        <div>
                            <span className='title'>DNI del dueño</span>
                                <input className={`form-control ${showDniDuenioError == true ? 'error-border' : ''}`} id= 'dniDuenio' placeholder='DNI del dueño' value = {dniDuenio}
                                    onChange={(e)=>setDniduenio(e.target.value)}>
                                </input>               
                        </div>
                        <span className={`${showDniDuenioError == true ? 'error-message' : 'hide-message'}`} >El DNI del dueño es requerido</span>

                        <div>
                            <span className='title'>Número del celular del dueño</span>
                                <input type="number" className={`form-control ${showCelularDuenioError == true ? 'error-border' : ''}`} id= 'celularDuenio' placeholder='Celular del dueño' value = {celularDuenio}
                                    onChange={(e)=>setCelularDuenio(e.target.value)}>
                                </input>               
                        </div>
                        <span className={`${showCelularDuenioError == true ? 'error-message' : 'hide-message'}`} >El número del celular del dueño es requerido</span>

                        <div className = 'd-grid col-6 mx-auto mt-3'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                        <div className='modal-footer mt-3'>
                            <button type='button' id= 'btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
            
        </div>        
    </div>
  )
}

export default ShowMascotas