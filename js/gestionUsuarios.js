$(document).ready(function(){
    $.ajax({
        method: 'get',
        url: 'http://localhost:8000/estudiantes'
    }).done((response)=>{
        const dataJson= JSON.parse(response);
        const usuarios =dataJson.data;
        const table = document.getElementById('estudiantesTb');
        const tbody= table.getElementsByTagName('tbody')[0];
        let html ='';
        usuarios.forEach(usuario => {
           html+='<tr>'
           html+='      <td>' + estudiante.codigo +'</td>';
           html+='      <td>'+ estudiante.nombre  +'</td>';
           html+='      <td>'+ estudiante.apellido  +'</td>';
           html+='      <td>';
           html+='          <button class="modificarBtn">Modificar</button>';
           html+='      </td>';
           html+='      <td>';
           html+='          <button class="eliminarBtn">Eliminar</button>';
           html+='      </td>';
           html+='</tr>';
            
        });
        tbody.innerHTML= html;
    }).fail((error)=>{
        console.error(error);
    });

    let band = 0;

    // funcionalidad para registrar 

    $(document).on("click", "#btnRegistrar", function(){

        document.getElementById('titulo').innerText = 'Registrar Estudiantes';
        band = 1;

    });

    
    //boton guardar 

    document.getElementById('guardarBtn').addEventListener('click', guardarUsuario);// evento de guardar
    
        function guardarUsuario() { // seleccion de datos de los input
            let name = document.getElementById('nameId').value;
            let username = document.getElementById('usernameId').value;
            let password = document.getElementById('passwordId').value;

        if(band == 0){
            alert("Debe seleccionar una funcionalidad para el botón");
            return;
        }else if(name.trim() === '' || username.trim() === '' || password.trim() === ''){
            alert ("No pueden haber campos vacios");
            return
        }

        if(band == 1){
            $.ajax({
                url: 'http://localhost:8000/usuarios',
                method: 'post',
                data: {
                    name: name.value,
                    username: username.value,
                    password: password.value
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg)
                location.reload();

            });
        }else if(band == 2){
            $.ajax({
                url: 'http://localhost:8000/usuarios/' + id,
                method: 'put',
                data:{
                         name: name.value,
                         username: username.value,
                         password: password.value
                     }
                 }).done(response=>{
                     const dataJson = JSON.parse(response);
                     const msg = dataJson.data; 
                     alert(msg);
                    location.reload();
                     
                 });
        }

    }

    // Eventos botones Modificar y Eliminar
    const modificarButtons = document.getElementsByClassName('modificar');
    const eliminarButtons = document.getElementsByClassName('eliminar');
    for (let i = 0; i < modificarButtons.length; i++) {
        modificarButtons[i].addEventListener('click', modificarUsuario);
        eliminarButtons[i].addEventListener('click', eliminarUsuario);
    }

            function modificarUsuario(event) {
        // Captura el botón clickeado.
        const button = event.target;

        // Obtiene el ID de usuario del atributo 'data-id' del botón.
        const usuarioId = button.getAttribute('data-id');

        // Encuentra la fila de la tabla más cercana al botón clickeado.
        const fila = button.closest('tr');

        // Obtiene los valores de nombre y nombre de usuario de las celdas 
        const name = fila.querySelector('td:nth-child(1)').textContent;
        const username = fila.querySelector('td:nth-child(2)').textContent;

        //nuevos input para nombre y nombre de usuario.
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = name;

        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.value = username;
        const pwd = document.createElement('input');
        pwd.type = 'password';
        pwd.value = '';
        pwd.placeholder = 'Contraseña'; // en el input se muestra la palabra contraseña 

        // Borra el contenido de las celdas de nombre y nombre de usuario.
        fila.querySelector('td:nth-child(1)').textContent = '';
        fila.querySelector('td:nth-child(2)').textContent = '';

        //input de nombre y nombre de usuario a las celdas
        fila.querySelector('td:nth-child(1)').appendChild(nameInput);
        fila.querySelector('td:nth-child(2)').appendChild(usernameInput);
        fila.querySelector('td:nth-child(2)').appendChild(pwd);

        // Actualiza el texto del botón a 'Guardar'.
        button.textContent = 'Guardar';

        // Remueve el evento  al botón, que con la función 'modificarUsuario'.
        button.removeEventListener('click', modificarUsuario);

        // oye el evento  al botón, que con la función 'guardarCambios'.
        button.addEventListener('click', guardarCambios);



        function guardarCambios(event) { // Define la función "guardarCambios" que se ejecuta cuando se activa un evento
            const button = event.target; // Obtiene una referencia al elemento que disparó el evento
            const fila = button.closest('tr'); // Busca el elemento <tr> más cercano al botón

            // referencias a los input dentro de la fila
            const nameInput = fila.querySelector('td:nth-child(1) input');
            const usernameInput = fila.querySelector('td:nth-child(2) input');
            const password = fila.querySelector('td:nth-child(3) input'); 

            // objeto "usuario" con sus propiedades 
            
                const usuario = {
                    name: nameInput.value, 
                    username: usernameInput.value, 
                    password: password 
                };
    
                $.ajax({
                    url: 'http://localhost:8000/usuarios/' + usuarioId,
                    method: 'put',
                    data: usuario
                }).done(response => {
                    const dataJson = JSON.parse(response);
                    const msg = dataJson.data;
                    alert(msg);
                    location.reload();
                });
            }
        }
    

    // Eliminar un usuario
    function eliminarUsuario(event) {
        const fila = event.target.closest('tr');
        const usuarioId = fila.getAttribute('data-id');

        $.ajax({
            url: 'http://localhost:8000/usuarios/' + usuarioId,
            method: 'delete'
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            fila.remove();
        });
    }

});
