/** Campos del formulario */
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

/** UI */
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let edicion;

/** Clases */
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.cita = this.cita.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {

    imprimirAlerta(mensaje, tipo) {

        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center', 'alert', 'd-block', 'col-12');

        tipo === "error"
            ? divAlerta.classList.add('alert-danger')
            : divAlerta.classList.add('alert-success');

        divAlerta.textContent = mensaje;

        const contenido = document.querySelector('#contenido');
        contenido.insertBefore(divAlerta, document.querySelector('.agregar-cita'));

        setTimeout(() => {
            divAlerta.remove();
        }, 5000);
    }

    imprimirCita({citas}) {

        this.limpiarHTML();

        citas.forEach( cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent= mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class="font-weight-boder">Propietario: </span> ${propietario}
            `;
            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class="font-weight-boder">Telefono: </span> ${telefono}
            `;
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weight-boder">Fecha: </span> ${fecha}
            `;
            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weight-boder">Hora: </span> ${hora}
            `;
            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class="font-weight-boder">Sintomas: </span> ${sintomas}
            `;
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>'
            btnEliminar.onclick = () => eliminarCita(id);

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = `Editar <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"></path></svg>`
            btnEditar.onclick = () => cargarEdicion(cita);

            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            contenedorCitas.appendChild(divCita);  
        });
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

/** Instacia de las clases */
const ui = new UI;
const administrarCitas = new Citas;

/** Registrar Eventos */
eventsListener();
function eventsListener() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

/** Objeto con la información de la cita */
const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: "",
}

/** Agrega datos del formulario al objeto citaObj */
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

/* Valida y crea una nueva cita */
function nuevaCita(e) {
    e.preventDefault();

    /* Extraer la información del objeto citaObj */
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    /* Validación de los campos */
    if (mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === "") {
        ui.imprimirAlerta("Todos los campos son obligatorios", "error");

        return;
    }

    if(edicion) { // Modo edición
        ui.imprimirAlerta("Editado correctamente");
        administrarCitas.editarCita({...citaObj});
        formulario.querySelector('button[type="submit"]').textContent = "Crear Cita";

        /* Quitamos modo edición */
        edicion = false;
    } else { // Modo Nueva Cita
        /* Generar un id unico para cada cita */
        citaObj.id = Date.now();
        /* Creando una nueva cita */
        administrarCitas.agregarCita({ ...citaObj });
        ui.imprimirAlerta("Se agrego correctamente");
    }

    
    resetObjeto();
    formulario.reset();

    ui.imprimirCita(administrarCitas);
}

function resetObjeto() {
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

function eliminarCita(id) {
    /* Eliminar la cita */
    administrarCitas.eliminarCita(id);
    /* Mensaje "Cita eleminada correctamente" */
    ui.imprimirAlerta("La cita se eliminó correctamente");
    /* Muestre la citas restantes */
    ui.imprimirCita(administrarCitas);
}

/**
 * Modo Edición
 * Devulve los datos cargados en sus respectivos inputs 
 */
function cargarEdicion(cita) {
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar el texto del button 
    formulario.querySelector('button[type="submit"]').textContent = "Guardar Cambios";

    edicion = true;
}

