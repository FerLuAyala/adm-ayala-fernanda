const app = Vue.createApp({
  data() {
    return {
      titulo: "IMC salud y deporte"
    };
  }
});

// Componente Padre
app.component('formulario-imc', {
  data() {
    //info guardada//
    const localData = localStorage.getItem("local")
   
    return {
      persona: {
        nombre: "",
        peso: "",
        altura: "",
        genero: "Hombre"

      },

     
      errores: {
        nombre: '',
        peso: '',
        altura: '',
        genero: '',
        
      },
      enviado: false,
      img: 'img/hombre-mujer-saludable.png',
      alt: "Plan nutricional peso normal",      
      //pregunto si ya existe paso el texto a objeto
      personas: localData ? JSON.parse(localData) : [],
    };
  },

  template: ` 
  <section id="navegacion">

  <div class="conten1">
      <div class="banner">
        <img :src="img" :alt="alt" />
      </div>
      <div class="descripcion">
        <h2>IMC</h2>
      <p>La importancia de tener un cuerpo saludable.<br> Te invitamos a conocer <br><strong>"Tu Indice de Masa Corporal"</strong></p>
      
      </div>
  </div>
  </section>  
 
  
  <section id="formulario">
   <h3>Calcular IMC</h3>
    <div class="contenedor-formulario">
     

        <div class="formulario">
       
          <h4>Completar para saber tu IMC </h4>
            <form @submit.prevent="guardar(persona)">
              <label>Nombre:</label>
              <input type="text" v-model="persona.nombre" placeholder="Ingrese su nombre"/>              
              <small :class="{ error: true, visible: !!errores.nombre }">{{ errores.nombre || ' ' }}</small>

            

              <label>Peso (kg sin coma):</label>
              <input type="number" v-model.number="persona.peso" placeholder="Ingrese su peso"/>
                    <small :class="{ error: true, visible: !!errores.peso }">{{ errores.peso || ' ' }}</small>

              <label>Altura (cm sin coma):</label>
              <input type="number" v-model.number="persona.altura" placeholder="Ingrese su altura"/>
                     <small :class="{ error: true, visible: !!errores.altura }">{{ errores.altura || ' ' }}</small>

              <label><p>Genero: {{ persona.genero }}</p></label>
              <label>Hombre
                <input type="radio" value="Hombre" v-model="persona.genero" />
              </label>
              <label>Mujer
                <input type="radio" value="Mujer" v-model="persona.genero" />
              </label>       

              <button type="submit">Quiero Saber</button>
            </form>
        </div>
    <div class="tabla">
       
        <ul>
         <li class="naranja">Tabla de referencia</li>
          <li class="bajo">Bajo peso menos de 18.5</li>
          <li class="normal">Normal 18.5 - 24.9</li>
          <li class="medio">Normal-A superior 25.0 - 30.0</li>
          <li class="sobrepeso">Sobrepeso más de 30.1</li>
        </ul>
    </div>
   
    </div>
  </section>  

  

  <div class="resultado" v-if="personas.length > 0">
  
  <div class="mostrar-resul">
    <h3>Resultados de IMC</h3>
    <mostrar-imc :personas="personas"></mostrar-imc>
  </div>
</div>
 
  
  `,

  methods: {
    guardar(persona) {
      console.log(persona)
      
      this.enviado = true;
      
      // Limpiar errores anteriores
    this.errores = {
      nombre: '',
      peso: '',
      altura: '',
      genero: ''
    };

    let valido = true;

    if (!persona.nombre) {
      this.errores.nombre = '*Por favor, complete el campo con su nombre';
      valido = false;
    }

    if (!persona.peso || persona.peso <= 0) {
      this.errores.peso = '*Por favor, complete el campo con su peso.';
      valido = false;
    }

    if (!persona.altura || persona.altura <= 0) {
      this.errores.altura = '*Por favor, complete el campo con su altura.';
      valido = false;
    }

    if (!persona.genero) {
      this.errores.genero = 'Debe seleccionar un género.';
      valido = false;
    }

  

        //si esta valido el formulario cargo los datos nesesarios para hacer el calculo
        if (valido) {
        const altu = this.persona.altura / 100;
        const imc = this.persona.peso / (altu * altu);
        const imcFinal = imc.toFixed(1);
        let estado = "";
        //condicional de estado
        if (imc < 18.5) estado = "Bajo peso";
        else if (imc >= 18.5 && imc <= 24.9) estado = "Normal";
        else if (imc >= 25 && imc <= 30.0) estado = "Normal-A superior";
        else if (imc >= 30.1) estado = "Sobrepeso";

        //creando objeto persona
        const fechaActual = new Date().toLocaleDateString();
        this.personas.push({
          nombre: this.persona.nombre,
          peso: this.persona.peso,
          altura: this.persona.altura,
          imc: imcFinal,
          estado: estado,
          fecha: fechaActual
        });
        //se van agregando los nuevos resultados al arreglo
        localStorage.setItem("local", JSON.stringify(this.personas));
        this.persona = { nombre: "", peso: "", altura: "", genero: "" };

      }
    }

  }
});
app.component('mostrar-imc', {

  props: ['personas'],
  template: `
    <div v-if="personas && personas.length > 0" class="contenedor-resultado">
          <ul>          
        <li v-for="(p, i) in personas" :key="i" :class="p.estado === 'Normal' ? 'normal' : (p.estado === 'Bajo peso' ? 'bajo' : (p.estado === 'Sobrepeso' ? 'sobrepeso' : 'medio'))">
          <p>Fecha del cálculo: {{ p.fecha }}</p>
          <p>Hola {{ formatearNombre(p.nombre) }} tu IMC es de {{ p.imc }} y estás en la categoría:  {{ formatearNombre(p.estado) }}.</p>
          <p>{{ informacion(p.estado) }}</p>
          <p><em>Es muy importante que tu IMC sea normal, para un mejor estilo de vida.</em></p>
          <button @click="eliminar(i)">Eliminar</button>
        </li>
      </ul>
 
    </div>
  `
  ,

  methods: {
    //segun el indice una info de su indice
    informacion(estado) {
      switch (estado) {
        case "Bajo peso":
          return "Tener un IMC bajo significa que tu Índice de Masa Corporal está por debajo del rango considerado saludable para tu estatura. Lo ideal es seguir un plan que te ayude a alcanzar un peso saludable de forma gradual, con una combinación de alimentación nutritiva y ejercicio adaptado. ";
        case "Normal":
          return "Tener un IMC normal significa que tu peso está dentro del rango saludable para tu estatura. Esto indica un buen equilibrio entre masa corporal y altura. Lo ideal es mantener este estado a través de una alimentación balanceada, actividad física regular y buenos hábitos de salud.";
        case "Normal-A superior":
          return "Tener Normal-A superior significa que tu peso está dentro del rango saludable para tu estatura, pero tambien muy cerca del sobrepeso lo que puede deberse a un exceso de grasa corporal.  Lo recomendable es adoptar un estilo de vida activo y ajustar la alimentación para reducir el peso de forma gradual y sostenible..";
        case "Sobrepeso":
          return "Tener sobrepeso significa que tu peso supera con claridad el rango saludable para tu estatura, generalmente por un exceso significativo de grasa corporal.Es fundamental buscar orientación profesional para diseñar un plan de alimentación, ejercicio y cuidado integral que permita mejorar tu calidad de vida y reducir los riesgos. ";
        default:
          return "Consulta con un especialista para una rutina personalizada.";

      }

    },

    //filtro para poner en mayuscula las letras

    formatearNombre(nombre) {
      if (!nombre) return "";
      return nombre.trim().toUpperCase();
    },

    //elimina del localstorage los resultados
    eliminar(indice) {
      this.personas.splice(indice, 1);
      //se actualiza localstorage
      localStorage.setItem("local", JSON.stringify(this.personas));
    },


  }
});

app.component('plan-recomendado', {
  data() {
    return {
      idSeleccionado: null,
      planes: [
        {
          id: "bajo",
          img: 'img/bajo.png',
          alt: "Plan nutricional bajo peso",
          titulo: "IMC Bajo Peso",
          subtitulo:"Alimentación:",
          texto: `Aumentá calorías con comidas nutritivas: frutos secos, aguacates, aceite de oliva.
                   Comé 5-6 veces al día, incluyendo snacks saludables.
                   Agregá proteínas: carne magra, huevos, legumbres.
                   Carbohidratos complejos como avena, arroz, quinoa.
                   Grasas buenas: pescados grasos, nueces, semillas.`,
                   subtitulo2:"Ejercicio",
          texto2: `Hacé entrenamiento de fuerza (pesas, sentadillas, flexiones).
                   Aumentá progresivamente el peso.
                   Descansá lo suficiente para permitir que crezca la masa muscular. `
        },
        {
          id: "normal",
          img: 'img/normal.png',
          alt: "Plan nutricional peso normal",
          titulo: "IMC Normal",
          subtitulo:"Alimentación:",
          texto: ` Mantené una dieta equilibrada con variedad de alimentos frescos.
                   Incluir frutas, verduras, proteínas magras, carbohidratos complejos y grasas saludables.
                   Evitá ultraprocesados y exceso de azúcar.
                   Hidratate bien durante el día.
                   Ajustá por objetivos: si querés tonificar, ganar músculo o simplemente mantenerte.`,
                   subtitulo2:"Ejercicio",
          texto2: `Combiná actividad cardiovascular moderada (caminar, trotar, bici) con fuerza muscular.
                   Entrená 3-5 veces por semana, adaptado a tu nivel.
                   Incluí estiramientos y movilidad para mejorar flexibilidad.
                   Ideal para mantener un peso saludable y mejorar la forma física.`
        },
        {
          id: "elevado",
          img: 'img/elevado.png',
          alt: "Plan nutricional sobrepeso",
          titulo: "IMC Superior",
          subtitulo:"Alimentación:",
          texto: `Reducí calorías poco a poco, priorizando alimentos naturales.
                   Elegí frutas, verduras, proteínas magras y granos integrales.
                   Evitá fritos, bebidas azucaradas y snacks ultraprocesados.
                   Comé porciones moderadas y comé despacio.
                   Mantené una buena hidratación y registrá tus comidas si te ayuda.`,
          subtitulo2:"Ejercicio",
          texto2: `Empezá con ejercicios de bajo impacto: caminar, bici, natación.
                   Gradualmente incorporá ejercicios de fuerza para tonificar.
                   Realizá actividad física al menos 4 veces por semana.
                   La constancia es clave para mejorar tu salud y reducir peso.`
        },
        {
          id: "sobrepeso",
          img: 'img/sobrepeso.png',
          alt: "Plan nutricional obesidad",
          titulo: "IMC Sobrepeso",
          subtitulo:"Alimentación:",
          texto: `Buscá apoyo profesional para un plan personalizado.
                   Reducí el consumo de azúcares, harinas refinadas y frituras.
                   Aumentá el consumo de verduras, proteínas magras y legumbres.
                   Planificá tus comidas para evitar decisiones impulsivas.
                   Comé con conciencia, sin pantallas, y escuchá tus señales de saciedad.`,
          subtitulo2:"Ejercicio",
          texto2: `Comenzá con ejercicios suaves y de bajo impacto (caminar, natación, yoga).
                   Consultá con un profesional antes de iniciar rutinas intensas.
                   Aumentá progresivamente la actividad física según tolerancia.
                   La actividad regular ayuda a mejorar el ánimo, el metabolismo y la salud en general.`
        }
      ]
    }
  },
  methods: {
    seleccionar(id) {
      this.idSeleccionado = this.idSeleccionado === id ? null : id;
    }
  },
  template: `
  <section id="contenedor-plan">
  <h3>Planes de alimentación y ejercicios sugeridos</h3>
    <div class="planes-container">
    
        <componente-hijo
          v-for="x in planes"
          :key="x.id"
          :id="x.id"
          :img="x.img"
          :alt="x.alt"
          :titulo="x.titulo"
          :texto="x.texto"
          :texto2="x.texto2"
          :subtitulo="x.subtitulo"
          :subtitulo2="x.subtitulo2"
          :seleccionado="x.id === idSeleccionado"
          @click-imagen="seleccionar"
        />
    </div>
</section>
  `
});
app.component('componente-hijo', {
  props: ["id", "titulo", "texto", "texto2", "subtitulo" , "subtitulo2" ,"img", "alt", "seleccionado"],
  emits: ["click-imagen"],
  template: `
  
  <div class="contenedor-tarjetas">
    <div class="plan-card">
      <div class="img-tarj">
        <img 
          :src="img" 
          :alt="alt"       
          :class="{ 'selected-img': seleccionado }"
          @click="$emit('click-imagen', id)"
        />
      </div>
      <div class="texto-plan">
        <h4>{{ titulo }}</h4>
        <div class="texInfo" v-if="seleccionado">
          <img src="img/alimento_icono.png" alt="Persona haciendo ejercicio" class="icono-ejercicio" />
          <span>{{subtitulo}}</span>
          <p>{{ texto }}</p>
          
          <img src="img/ejercicio_icono.png" alt="Persona haciendo ejercicio" class="icono-ejercicio" />
          <span>{{subtitulo2}}</span>
          <p>{{ texto2 }}</p>
        </div>       
      </div>
    </div>
  </div>


  `
  
});



app.mount('.contenedor');
