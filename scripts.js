const usuario = "nestorbn48";
const repositorio = "GSheetsIMG";
const rama = "main";
const carpeta = "img";

const galeria = document.getElementById("galeria");

const extensiones = ["jpg", "jpeg", "png", "gif", "webp", "avif"];

async function cargarImagenes() {

    const url = `https://api.github.com/repos/${usuario}/${repositorio}/contents/${carpeta}?ref=${rama}`;

    try {

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("No se pudo acceder a la carpeta img");
        }

        const archivos = await respuesta.json();

        const imagenes = archivos
            .filter(archivo => {
                if (archivo.type !== "file") return false;

                const extension = archivo.name
                    .split(".")
                    .pop()
                    .toLowerCase();

                return extensiones.includes(extension);
            })
            .sort((a, b) =>
                a.name.localeCompare(
                    b.name,
                    undefined,
                    { numeric: true }
                )
            );

        imagenes.forEach(archivo => {

            const imagen = document.createElement("img");

            imagen.src =
                `https://raw.githubusercontent.com/${usuario}/${repositorio}/${rama}/${carpeta}/${encodeURIComponent(archivo.name)}`;

            imagen.alt = archivo.name;

            galeria.appendChild(imagen);

        });

    } catch (error) {

        console.error(error);

    }
}

cargarImagenes();
