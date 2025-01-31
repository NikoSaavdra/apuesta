
function cargarPartidos() {
    fetch('http://localhost:8080/partidos')  
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#partidosTable tbody');
            tableBody.innerHTML = '';  

            data.forEach(partido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${partido.id}</td>
                    <td>${partido.nombre}</td>
                    <td>${partido.descripcion}</td>
                    <td>${partido.deporte}</td>
                    <td>${partido.resultado}</td>
                    <td>${partido.apuesta}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="verDetalle(${partido.id})">Ver</button>
                        <button class="btn btn-warning btn-sm" onclick="editarPartido(${partido.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="borrarPartido(${partido.id})">Borrar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar los partidos:', error);
        });
}

function editarPartido(id) {
    fetch(`http://localhost:8080/partidos/${id}`)
        .then(response => response.json())
        .then(partido => {
            document.getElementById('editarId').value = partido.id;
            document.getElementById('editarNombre').value = partido.nombre;
            document.getElementById('editarDeporte').value = partido.deporte;
            document.getElementById('editarDescripcion').value = partido.descripcion;
            document.getElementById('editarApuesta').value = partido.apuesta;
        
            document.getElementById('editarResultado').value = partido.resultado;
            $('#modalEditar').modal('show'); 
        })
        .catch(error => {
            console.error('Error al cargar el partido para editar:', error);
        });
}

// Función para crear un nuevo partido
function crearPartido() {
    const nombre = document.getElementById('crearNombre').value;
    const deporte = document.getElementById('crearDeporte').value;
    const descripcion = document.getElementById('crearDescripcion').value;
    const apuesta = document.getElementById('crearApuesta').value;

    const partido = {
        nombre: nombre,
        deporte: deporte,
        descripcion: descripcion,
        apuesta: apuesta
    };

    fetch('http://localhost:8080/partidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(partido)
    })
    .then(response => response.json())
    .then(data => {
        $('#modalCrear').modal('hide');  
        cargarPartidos();  
    })
    .catch(error => {
        console.error('Error al crear el partido:', error);
    });
}

function cerrarDetalle() {
    document.getElementById('detallePartido').style.display = 'none';
}

// Función para borrar un partido
function borrarPartido(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este partido?")) {
        fetch(`http://localhost:8080/partidos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Partido eliminado correctamente');
                cargarPartidos();  // Recargar la lista de partidos después de eliminar
            } else {
                alert('No se pudo eliminar el partido');
            }
        })
        .catch(error => {
            console.error('Error al eliminar el partido:', error);
        });
    }
}

// Función para actualizar un partido
function actualizarPartido() {
    const id = document.getElementById('editarId').value;
    const nombre = document.getElementById('editarNombre').value;
    const deporte = document.getElementById('editarDeporte').value;
    const descripcion = document.getElementById('editarDescripcion').value;
    const apuesta = document.getElementById('editarApuesta').value;
    const resultado = document.getElementById('editarResultado').value;  

    const partido = {
        nombre: nombre,
        deporte: deporte,
        descripcion: descripcion,
        apuesta: apuesta,
        resultado: parseInt(resultado) 
    };


    fetch(`http://localhost:8080/partidos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(partido)
    })
    .then(response => response.json())
    .then(data => {
        $('#modalEditar').modal('hide'); 
        cargarPartidos();  
    })
    .catch(error => {
        console.error('Error al actualizar el partido:', error);
    });
}
// Función para cerrar la sección de detalle
function cerrarDetalle() {
    document.getElementById('detallePartido').style.display = 'none';
}

window.onload = cargarPartidos;

function verDetalle(id) {
    fetch(`http://localhost:8080/partidos/${id}`)
    .then(response => response.json())
    .then(partido => {
    
        document.getElementById('detalleId').innerText = partido.id;
        document.getElementById('detalleNombre').innerText = partido.nombre;
        document.getElementById('detalleDeporte').innerText = partido.deporte;
        document.getElementById('detalleDescripcion').innerText = partido.descripcion;
        document.getElementById('detalleApuesta').innerText = partido.apuesta;

        let resultado = Number(partido.resultado);  

        let resultadoMensaje = '';
        if (isNaN(resultado)) {
            resultadoMensaje = 'Resultado no disponible';
        } else if (resultado === 0) {
            resultadoMensaje = 'Partido Pendiente';
        } else if (resultado === 1) {
            resultadoMensaje = 'Partido Ganado';
        } else if (resultado === -1) {
            resultadoMensaje = 'Partido Perdido';
        }

        document.getElementById('detalleResultado').innerText = resultadoMensaje;

        document.getElementById('detallePartido').style.display = 'block';
    })
    .catch(error => {
        console.error('Error al obtener los detalles del partido:', error);
        alert('No se pudo cargar el detalle del partido');
    });
}
