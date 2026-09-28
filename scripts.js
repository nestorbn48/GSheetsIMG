/* =========================================
   CONFIGURACIÓN DE GITHUB
========================================= */

const USUARIO = "nestorbn48";

const REPOSITORIO = "GSheetsIMG";

const RAMA = "main";

const CARPETA = "img";


/* =========================================
   EXTENSIONES PERMITIDAS
========================================= */

const extensionesPermitidas = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "avif"
];


/* =========================================
   ELEMENTOS HTML
========================================= */

const galeria =
    document.getElementById("galeria");

const contador =
    document.getElementById("contador");

const visor =
    document.getElementById("visor");

const imagenGrande =
    document.getElementById("imagenGrande");

const cerrar =
    document.getElementById("cerrar");


/* =========================================
   CARGAR IMÁGENES DESDE GITHUB
========================================= */

async function cargarImagenes() {

    const apiURL =
        `https://api.github.com/repos/` +
        `${USUARIO}/${REPOSITORIO}/contents/` +
        `${CARPETA}?ref=${RAMA}`;

    try {

        const respuesta =
            await fetch(apiURL);

        if (!respuesta.ok) {

            throw new Error(
                `GitHub respondió con el código ${respuesta.status}`
            );

        }

        const archivos =
            await respuesta.json();


        /* =====================================
           FILTRAR IMÁGENES
        ===================================== */

        const imagenes =
            archivos.filter(archivo => {

                if (archivo.type !== "file") {
                    return false;
                }

                const extension =
                    archivo.name
                        .split(".")
                        .pop()
                        .toLowerCase();

                return extensionesPermitidas
                    .includes(extension);

            });


        /* =====================================
           ORDENAR POR NOMBRE
        ===================================== */

        imagenes.sort((a, b) =>
            a.name.localeCompare(
                b.name,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            )
        );


        /* =====================================
           LIMPIAR GALERÍA
        ===================================== */

        galeria.innerHTML = "";


        /* =====================================
           SIN IMÁGENES
        ===================================== */

        if (imagenes.length === 0) {

            galeria.innerHTML = `

                <div class="sin-imagenes">

                    No hay imágenes
                    en la carpeta img.

                </div>

            `;

            contador.textContent =
                "0 imágenes";

            return;
        }


        /* =====================================
           CONTADOR
        ===================================== */

        contador.textContent =
            `${imagenes.length} ` +
            `imagen${imagenes.length !== 1
                ? "es"
                : ""}`;


        /* =====================================
           CREAR IMÁGENES
        ===================================== */

        imagenes.forEach(archivo => {

            const contenedor =
                document.createElement("div");

            contenedor.className =
                "imagen-container";


            const imagen =
                document.createElement("img");


            /*
             * URL directa de GitHub
             */

            imagen.src =
                `https://raw.githubusercontent.com/` +
                `${USUARIO}/` +
                `${REPOSITORIO}/` +
                `${RAMA}/` +
                `${CARPETA}/` +
                `${encodeURIComponent(archivo.name)}`;


            /*
             * Texto alternativo
             */

            imagen.alt =
                archivo.name;


            /*
             * Carga progresiva
             */

            imagen.loading =
                "lazy";


            /*
             * Abrir visor
             */

            imagen.addEventListener(
                "click",
                () => {

                    imagenGrande.src =
                        imagen.src;

                    imagenGrande.alt =
                        imagen.alt;

                    visor.classList.add(
                        "activo"
                    );

                    document.body.style
                        .overflow = "hidden";

                }
            );


            contenedor.appendChild(
                imagen
            );

            galeria.appendChild(
                contenedor
            );

        });


    } catch (error) {

        console.error(error);

        galeria.innerHTML = `

            <div class="error">

                No se han podido cargar
                las imágenes.

                <br><br>

                Comprueba que la carpeta
                <strong>img</strong> existe
                en el repositorio.

            </div>

        `;

        contador.textContent =
            "Error al cargar las imágenes";

    }

}


/* =========================================
   CERRAR VISOR
========================================= */

function cerrarVisor() {

    visor.classList.remove(
        "activo"
    );

    imagenGrande.src = "";

    document.body.style
        .overflow = "";

}


/* =========================================
   BOTÓN CERRAR
========================================= */

cerrar.addEventListener(
    "click",
    cerrarVisor
);


/* =========================================
   CERRAR AL HACER CLIC FUERA
========================================= */

visor.addEventListener(
    "click",
    evento => {

        if (evento.target === visor) {

            cerrarVisor();

        }

    }
);


/* =========================================
   CERRAR CON ESC
========================================= */

document.addEventListener(
    "keydown",
    evento => {

        if (evento.key === "Escape") {

            cerrarVisor();

        }

    }
);


/* =========================================
   INICIAR
========================================= */

cargarImagenes();