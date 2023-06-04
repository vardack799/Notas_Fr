let bandera = 0;
$(document).ready(function () {
            $.ajax({
                method: 'get',
                url: 'http://localhost:8000/estudiantes'
            }).done((response) => {

                const dataJson = JSON.parse(response);
                const estudiantes = dataJson.data;
                const table = document.getElementById('estudiantesTb');
                const tbody = table.getElementsByTagName('tbody')[0];
                let html = '';
                estudiantes.forEach(estudiante => {
                    html += '<tr>';//data-id="' + estudiante.codigo + '" 
                    html += '   <td>' + estudiante.codigo + '</td>'; 
                    html += '   <td>' + estudiante.nombres + '</td>'; 
                    html += '   <td>' + estudiante.apellidos + '</td>'; 
                    html += '      <td>';
                    html += '         <button class="modificarBtn" data-id="' + estudiante.codigo + '">Modificar</button>';
                    html += '      </td>';
                    html += '      <td>';
                    html += '         <button class="eliminarBtn" data-id="' + estudiante.codigo + '">Eliminar</button>';
                    html += '      </td>';
                    html += '        <td>';
                    html += '          <button class="notasBtn" data-codigo="' + estudiante.codigo + '" data-nombres="' + estudiante.nombres + '" data-apellidos="' + estudiante.apellidos + '">Notas</button>';
                    html += '        </td>';
                    html += '</tr>';
                });
        
                tbody.innerHTML = html;

               
            }).fail((error) => {
                console.error(error);
            });
});

        // funcionalidad para registrar 

            $(document).on("click", "#registrarBtn", function(){

                document.getElementById('titulo').innerText = 'Registrar Estudiantes';
                bandera = 1;

            });


            //boton guardar 
        document.getElementById('guardarBtn').addEventListener('click', guardarEstudiante);

        function guardarEstudiante() {
            //valores de los input
            let codigo = document.getElementById('codigoId').value;
            let nombres = document.getElementById('nombresId').value;
            let apellidos = document.getElementById('apellidosId').value;

            // Validar que no haya campos vacíos
            if (!codigo || !nombres || !apellidos) {
                alert("No pueden haber campos vacíos");
                return;
            }

            if (bandera == 0) {
                alert("Debe seleccionar una funcionalidad para el botón");
                return;
            }

            if (bandera == 1) {
                $.ajax({
                    url: 'http://localhost:8000/nuevoEstudiante',
                    method: 'post',
                    data: {
                        codigo: codigo,
                        nombres: nombres,
                        apellidos: apellidos
                    }
                }).done(response => {
                    const dataJson = JSON.parse(response);
                    const msg = dataJson.data;
                    alert(msg);
                    location.reload();
                });
            }
        }

        $(document).on("click", ".eliminarBtn", function() {
            const estCod = $(this).attr("data-id");
        
            $.ajax({
                url: `http://localhost:8000/borrarEstudiante/${estCod}`,
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
        

        $(document).on("click", ".modificarBtn", function() {
            const estCod = $(this).attr("data-id");
        
            // Encuentra la fila de la tabla más cercana al botón clickeado.
            const fila = $(this).closest('tr');
        
            // Obtiene los valores de código, nombres y apellidos de las celdas correspondientes.
            const codigo = fila.find('td:nth-child(1)').text();
            const nombres = fila.find('td:nth-child(2)').text();
            const apellidos = fila.find('td:nth-child(3)').text();
        
            // Crea elementos de input para los valores de código, nombres y apellidos.
            const codigoInput = $('<input type="number" value="' + codigo + '">');
            const nombresInput = $('<input type="text" value="' + nombres + '">');
            const apellidosInput = $('<input type="text" value="' + apellidos + '">');
        
            // Reemplaza las celdas correspondientes con los inputs.
            fila.find('td:nth-child(1)').html(codigoInput);
            fila.find('td:nth-child(2)').html(nombresInput);
            fila.find('td:nth-child(3)').html(apellidosInput);
        
            // Crea un botón "Guardar" para confirmar los cambios.
            const guardarBtn = $('<button class="guardarCambiosBtn">Guardar</button>');
            fila.find('td:last-child').html(guardarBtn);
        
            // Agrega un evento al botón "Guardar" para guardar los cambios.
            guardarBtn.on('click', function() {
                const nuevoCodigo = codigoInput.val();
                const nuevosNombres = nombresInput.val();
                const nuevosApellidos = apellidosInput.val();
        
                // Realiza la solicitud AJAX para modificar el estudiante.
                $.ajax({
                    url: 'http://localhost:8000/cambiarEstudiante/' + estCod,
                    method: 'put',
                    data: {
                        codigo: nuevoCodigo,
                        nombres: nuevosNombres,
                        apellidos: nuevosApellidos
                    }
                }).done(function(response) {
                    const dataJson = JSON.parse(response);
                    const msg = dataJson.data;
                    alert(msg);
                    location.reload();
                }).fail(function(error) {
                    console.error(error);
                });
            });
        });
                
                // Evento click en el botón Notas
        $(document).on("click", ".notasBtn", function() {
            const codigo = $(this).data("codigo");
            const nombres = $(this).data("nombres");
            const apellidos = $(this).data("apellidos");

            // Almacenar la información en localStorage
            localStorage.setItem("codigo", codigo);
            localStorage.setItem("nombres", nombres);
            localStorage.setItem("apellidos", apellidos);

            // Redirigir a la página "actividades"
            window.location.href = "actividades.html";
        });


