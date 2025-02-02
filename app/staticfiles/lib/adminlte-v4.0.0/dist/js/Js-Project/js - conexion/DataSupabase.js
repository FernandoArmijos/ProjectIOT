// Configuración de Supabase
const SUPABASE_URL = "https://tuproyecto.supabase.co"; // Cambia por tu URL
const SUPABASE_KEY = "tu-api-key"; // Cambia por tu clave
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Función para obtener datos
async function fetchData() {
    const { data, error } = await supabase
        .from('nombre_tabla') // Cambia por el nombre de tu tabla
        .select('*');

    if (error) {
        console.error("Error al obtener datos:", error);
        return;
    }

    // Mostrar los datos en la página
    const list = document.getElementById('data-list');
    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - ${item.edad}`; // Ajusta según los campos
        list.appendChild(li);
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchData);