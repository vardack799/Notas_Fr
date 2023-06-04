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
                    html+='        <td>';
                    html+='          <button class="notasBtn" data-id="' + estudiante.codigo + '">Notas</button>';
                    html+='        </td>';
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
        
    

