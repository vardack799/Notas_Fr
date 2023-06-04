// Obtener los valores almacenados en localStorage
const nombres = localStorage.getItem("nombres");
const apellidos = localStorage.getItem("apellidos");
const codigoEstudiante = localStorage.getItem("codigo");

// Utilizar los valores obtenidos
document.getElementById('nombresTxt').innerText = "Nombres: " + nombres;
document.getElementById('apellidosTxt').innerText = "Apellidos: " + apellidos;

let banderAct = 0;

$.ajax({
    method: 'get',
    url: 'http://localhost:8000/actividades/' + codigoEstudiante,
}).done((response) => {
    const dataJson = JSON.parse(response);
    const actividades = dataJson.data;
    const table = document.getElementById('actividadesTb');
    const tbody = table.getElementsByTagName('tbody')[0];
    let html = '';

    actividades.forEach(actividad => {
        html += '<tr>'
        html += '      <td>' + actividad.id + '</td>';
        html += '      <td>' + actividad.descripcion + '</td>';
        html += '      <td>' + actividad.nota + '</td>';
        html += '      <td class="table-content">';
        html += '          <button class="modificarBtn" data-id="' + actividad.id + '">Modificar</button>';
        html += '      </td>';
        html += '      <td>';
        html += '          <button class="eliminarBtn" data-id="' + actividad.id + '">Eliminar</button>';
        html += '      </td>';
        html += '</tr>';
    });

    tbody.innerHTML = html;

    // Calcular promedio de notas
    calcularPromedioNotas(actividades);

}).fail((error) => {
    console.error(error);
});

// Registrar
$(document).on("click", "#registrarActBtn", function() {
    document.getElementById('titulo').innerText = 'Registrar Actividad';
    banderAct = 1;
});

// Modificar
$(document).on("click", ".modificarBtn", function() {
    document.getElementById('titulo').innerText = 'Modificar';

    banderAct = 2;
    id = $(this).data("id");
    var descripcion = $(this).closest("tr").find("td:eq(1)").text();
    var nota = $(this).closest("tr").find("td:eq(2)").text();

    $("#descripcionId").val(descripcion);
    $("#notaId").val(nota);
});

// Guardar
$(document).on("click", "#guardarBtn", function() {
    var descripcion = document.getElementById('descripcionId');
    var nota = document.getElementById('notaId');

    if (!descripcion || !nota) {
        alert("Ingrese correctamente la información");
        location.reload();
        return;
    } else if (nota.value < 0 || nota.value > 5) {
        alert("La nota debe estar entre 0 y 5 incluyendo sus decimales");
        location.reload();
        return;
    } else if (banderAct == 0) {
        alert("Seleccione una de las diferentes opciones disponibles para que el botón pueda funcionar");
        return;
    } else if (banderAct == 1) {
        $.ajax({
            url: 'http://localhost:8000/nuevActividades',
            method: 'post', // Nuevo registro
            data: {
                descripcion: descripcion.value,
                nota: nota.value,
                codigoEstudiante: codigoEstudiante
            }
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            location.reload();
        });
    } else if (banderAct == 2) {
        $.ajax({
            url: 'http://localhost:8000/CambiActividades/' + id,
            method: 'put', // Actualizar un registro
            data: {
                descripcion: descripcion.value,
                nota: nota.value
            }
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            location.reload();
        });
    }
});

// Eliminar
$(document).on("click", ".eliminarBtn", function() {
    const idAct = $(this).attr("data-id");

    $.ajax({
        url: `http://localhost:8000/borrActividades/` + idAct,
        method: 'delete',
        dataType: 'json'
    }).done(function(response) {
        const msg = response.data;
        alert(msg);
        location.reload();
    }).fail(function(error) {
        const msg = error.responseJSON.data;
        alert(msg);
    });
});

// Calcular promedio de notas
function calcularPromedioNotas(actividades) {
    let totalNotas = 0;
    let cantidadNotas = actividades.length;
  
    actividades.forEach(actividad => {
      totalNotas += parseFloat(actividad.nota);
    });
  
    let promedio = cantidadNotas > 0 ? totalNotas / cantidadNotas : 0;
    let promedioText = cantidadNotas > 0 ? promedio.toFixed(2) : "";
  
    if (cantidadNotas > 0) {
      document.getElementById('promedioEnunciado').innerText = "Promedio de notas:";
      document.getElementById('promedioValor').innerText = promedioText;
      document.getElementById('promedioContainer').style.display = "block";
    } else {
      document.getElementById('promedioContainer').style.display = "none";
    }
  }
  