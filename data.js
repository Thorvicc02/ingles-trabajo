const LEVELS = ["A2", "B1", "B2"];
const LVL_LABEL = { A2: "A2 Básico", B1: "B1 Intermedio", B2: "B2 Avanzado" };
const THEMES = ["entrevista", "hoteleria", "cliente", "it", "oficina"];
const TH_LABEL = {
  entrevista: "Entrevista de trabajo",
  hoteleria: "Hotelería / Restaurante",
  cliente: "Atención al cliente",
  it: "Soporte IT / Redes",
  oficina: "Oficina / Email",
};

const WORDS = {
  A2: {
    entrevista: [
      ["resume", "currículum", "I sent my resume yesterday."],
      ["experience", "experiencia", "I have two years of experience as a waiter."],
      ["skill", "habilidad", "My main skill is fixing network problems."],
      ["salary", "sueldo", "What is the salary for this job?"],
      ["schedule", "horario", "Is the schedule flexible?"],
    ],
    hoteleria: [
      ["menu", "carta / menú", "Can I see the menu, please?"],
      ["bill", "cuenta", "Here is your bill."],
      ["table", "mesa", "A table for two, please."],
      ["order", "pedir / pedido", "Are you ready to order?"],
      ["reservation", "reserva", "I have a reservation for eight o'clock."],
    ],
    cliente: [
      ["customer", "cliente", "The customer is waiting on the phone."],
      ["help", "ayudar / ayuda", "How can I help you?"],
      ["problem", "problema", "What is the problem?"],
      ["refund", "reembolso", "I want a refund, please."],
      ["wait", "esperar", "Please wait a moment."],
    ],
    it: [
      ["password", "contraseña", "I forgot my password."],
      ["screen", "pantalla", "The screen is black."],
      ["cable", "cable", "Check the network cable."],
      ["restart", "reiniciar", "Please restart your computer."],
      ["internet", "internet", "The internet is not working."],
    ],
    oficina: [
      ["meeting", "reunión", "The meeting starts at ten."],
      ["email", "correo electrónico", "I will send you an email."],
      ["attach", "adjuntar", "I attached the document."],
      ["deadline", "fecha límite", "The deadline is Friday."],
      ["manager", "jefe / gerente", "My manager is very kind."],
    ],
  },
  B1: {
    entrevista: [
      ["strength", "fortaleza", "My biggest strength is working under pressure."],
      ["weakness", "debilidad", "My weakness is that I am too perfectionist."],
      ["reference", "referencia", "My previous boss can be a reference."],
      ["available", "disponible", "I am available to start in April."],
      ["apply", "postular", "I would like to apply for the receptionist position."],
    ],
    hoteleria: [
      ["tip", "propina", "Tips are shared among the staff."],
      ["shift", "turno", "I work the night shift."],
      ["guest", "huésped / cliente", "The guests are checking in at three."],
      ["allergy", "alergia", "Do you have any food allergies?"],
      ["recommend", "recomendar", "What would you recommend?"],
    ],
    cliente: [
      ["complaint", "reclamo", "I would like to make a complaint."],
      ["apologize", "pedir disculpas", "We apologize for the inconvenience."],
      ["resolve", "resolver", "I will do my best to resolve this today."],
      ["escalate", "derivar a un superior", "I will escalate your case to a supervisor."],
      ["satisfied", "satisfecho", "Are you satisfied with the service?"],
    ],
    it: [
      ["troubleshoot", "diagnosticar y solucionar", "Let's troubleshoot the problem step by step."],
      ["router", "router", "Try unplugging the router for ten seconds."],
      ["update", "actualizar", "You need to update the software."],
      ["ticket", "ticket / caso", "I opened a ticket for your issue."],
      ["connection", "conexión", "The connection keeps dropping."],
    ],
    oficina: [
      ["attachment", "archivo adjunto", "Please see the attachment."],
      ["reschedule", "reprogramar", "Could we reschedule the meeting?"],
      ["follow up", "dar seguimiento", "I am following up on my last email."],
      ["agenda", "orden del día", "Here is the agenda for today."],
      ["colleague", "colega", "My colleague will help you."],
    ],
  },
  B2: {
    entrevista: [
      ["achievement", "logro", "My biggest achievement was leading a team of five."],
      ["fluent", "fluido", "I am fluent in Spanish and have a good level of English."],
      ["work permit", "permiso de trabajo", "I have a work permit valid until February 2028."],
      ["notice period", "período de preaviso", "My notice period is two weeks."],
      ["challenge", "desafío", "I enjoy taking on new challenges."],
    ],
    hoteleria: [
      ["upsell", "ofrecer algo adicional", "I tried to upsell the tasting menu."],
      ["complimentary", "de cortesía", "Breakfast is complimentary."],
      ["overbooked", "sobrevendido", "Unfortunately, the hotel is overbooked tonight."],
      ["hospitality", "hospitalidad / hotelería", "I have experience in the hospitality industry."],
      ["check out", "hacer el check-out", "Check-out is at eleven."],
    ],
    cliente: [
      ["inconvenience", "molestia", "Sorry for the inconvenience."],
      ["empathize", "empatizar", "I empathize with your frustration."],
      ["compensation", "compensación", "We can offer you compensation."],
      ["retention", "retención de clientes", "Our goal is customer retention."],
      ["resolution", "resolución", "The average resolution time is two hours."],
    ],
    it: [
      ["bandwidth", "ancho de banda", "The bandwidth is too low for video calls."],
      ["latency", "latencia", "High latency causes lag."],
      ["firewall", "cortafuegos", "The firewall is blocking the port."],
      ["outage", "caída del servicio", "There is an outage in the area."],
      ["root cause", "causa raíz", "We need to find the root cause."],
    ],
    oficina: [
      ["stakeholder", "parte interesada", "We must keep all stakeholders informed."],
      ["deliverable", "entregable", "The first deliverable is due next week."],
      ["prioritize", "priorizar", "We need to prioritize urgent tickets."],
      ["feedback", "retroalimentación", "I would appreciate your feedback."],
      ["touch base", "ponerse en contacto", "Let's touch base next week."],
    ],
  },
};

const SENTS = {
  A2: {
    entrevista: [
      ["Nice to meet you. My name is Víctor.", "Mucho gusto. Mi nombre es Víctor."],
      ["I worked as a waiter for two years.", "Trabajé como garzón durante dos años."],
      ["I can start next month.", "Puedo empezar el próximo mes."],
    ],
    hoteleria: [
      ["Welcome! Do you have a reservation?", "¡Bienvenidos! ¿Tienen reserva?"],
      ["Would you like something to drink?", "¿Desea algo para beber?"],
      ["I will bring the bill now.", "Ahora traigo la cuenta."],
    ],
    cliente: [
      ["How can I help you today?", "¿En qué puedo ayudarle hoy?"],
      ["Please wait a moment.", "Por favor espere un momento."],
      ["I am sorry for the problem.", "Lamento el problema."],
    ],
    it: [
      ["Have you tried restarting the computer?", "¿Ha probado reiniciar el computador?"],
      ["Is the cable connected?", "¿Está conectado el cable?"],
      ["What is your username?", "¿Cuál es su nombre de usuario?"],
    ],
    oficina: [
      ["I will send you the file today.", "Le enviaré el archivo hoy."],
      ["The meeting is at three o'clock.", "La reunión es a las tres."],
      ["Thank you for your help.", "Gracias por su ayuda."],
    ],
  },
  B1: {
    entrevista: [
      ["I am applying for the receptionist position.", "Postulo al cargo de recepcionista."],
      ["I am a fast learner and I work well in a team.", "Aprendo rápido y trabajo bien en equipo."],
      ["Could you tell me more about the working hours?", "¿Podría contarme más sobre el horario de trabajo?"],
    ],
    hoteleria: [
      ["Are you ready to order, or do you need more time?", "¿Están listos para pedir o necesitan más tiempo?"],
      ["Do you have any allergies I should know about?", "¿Tienen alguna alergia que deba saber?"],
      ["Your room will be ready in about twenty minutes.", "Su habitación estará lista en unos veinte minutos."],
    ],
    cliente: [
      ["I understand how frustrating this must be.", "Entiendo lo frustrante que debe ser esto."],
      ["Let me check that for you.", "Déjeme revisarlo por usted."],
      ["I will transfer you to the right department.", "Lo transferiré al departamento correcto."],
    ],
    it: [
      ["Can you describe exactly what happens when you try to log in?", "¿Puede describir exactamente qué ocurre cuando intenta iniciar sesión?"],
      ["Please unplug the router and plug it back in after ten seconds.", "Desconecte el router y vuélvalo a conectar después de diez segundos."],
      ["I have opened a ticket and you will receive an update by email.", "He abierto un caso y recibirá una actualización por correo."],
    ],
    oficina: [
      ["I am writing to follow up on our last meeting.", "Le escribo para dar seguimiento a nuestra última reunión."],
      ["Could we reschedule for Thursday morning?", "¿Podríamos reprogramar para el jueves por la mañana?"],
      ["Please find the report attached.", "Adjunto encontrará el informe."],
    ],
  },
  B2: {
    entrevista: [
      ["One of my biggest achievements was reducing network downtime by thirty percent.", "Uno de mis mayores logros fue reducir en un treinta por ciento el tiempo de caída de la red."],
      ["I am looking for a role where I can grow and take on more responsibility.", "Busco un puesto donde pueda crecer y asumir más responsabilidad."],
      ["I hold a Working Holiday visa, so I do not need sponsorship.", "Tengo una visa Working Holiday, así que no necesito patrocinio."],
    ],
    hoteleria: [
      ["I am afraid we are fully booked tonight, but I can check nearby hotels.", "Me temo que estamos completos esta noche, pero puedo consultar hoteles cercanos."],
      ["May I suggest our chef's special? It pairs well with this wine.", "¿Puedo sugerir el especial del chef? Combina bien con este vino."],
      ["I apologize for the delay; your meal is on the house.", "Me disculpo por la demora; su comida va por la casa."],
    ],
    cliente: [
      ["I completely understand your frustration, and I would like to make this right.", "Entiendo completamente su frustración y quiero solucionarlo."],
      ["If the issue persists, I will escalate it to our technical team.", "Si el problema persiste, lo derivaré a nuestro equipo técnico."],
      ["As a gesture of goodwill, we would like to offer you a discount.", "Como gesto de buena voluntad, queremos ofrecerle un descuento."],
    ],
    it: [
      ["The root cause seems to be a misconfigured firewall rule.", "La causa raíz parece ser una regla de cortafuegos mal configurada."],
      ["We are experiencing an outage and our engineers are working on it.", "Tenemos una caída del servicio y nuestros ingenieros están trabajando en ello."],
      ["Could you run a speed test and tell me the latency?", "¿Podría hacer una prueba de velocidad y decirme la latencia?"],
    ],
    oficina: [
      ["I would appreciate your feedback before the deadline on Friday.", "Agradecería sus comentarios antes del plazo del viernes."],
      ["Let's touch base early next week to align on priorities.", "Hablemos a inicios de la próxima semana para alinear prioridades."],
      ["Apologies for the late reply; I was out of the office.", "Disculpe la demora en responder; estaba fuera de la oficina."],
    ],
  },
};

const ALL_WORDS = [];
const ALL_SENTS = [];
LEVELS.forEach((l) => {
  THEMES.forEach((t) => {
    WORDS[l][t].forEach((w, i) => ALL_WORDS.push({ id: `${l}-${t}-${i}`, lvl: l, th: t, en: w[0], es: w[1], ex: w[2] }));
    SENTS[l][t].forEach((s, i) => ALL_SENTS.push({ id: `${l}-${t}-${i}`, lvl: l, th: t, en: s[0], es: s[1] }));
  });
});


/* ---------- Checo de supervivencia (A0–A1) ----------
   El campo `en` guarda el texto en el idioma que se estudia (aquí, checo),
   para reutilizar las mismas vistas. `pron` es una pista al estilo español.
   `ex` / `exes` son un ejemplo en checo y su traducción.
*/
const CS_LEVELS = ["A1"];
const CS_LVL_LABEL = { A1: "A0–A1 Supervivencia" };
const CS_THEMES = ["saludos", "numeros", "transporte", "compras", "vivienda", "trabajo", "emergencias", "curso-1", "curso-2", "curso-3", "curso-4", "curso-5", "curso-6", "curso-7"];
const CS_TH_LABEL = {
  saludos: "Saludos y cortesía",
  numeros: "Números y dinero",
  transporte: "Transporte y ciudad",
  compras: "Compras y supermercado",
  vivienda: "Vivienda / arriendo",
  trabajo: "Trabajo (primer día)",
  emergencias: "Emergencias y salud",
  "curso-1": "Clase 1 · Pronunciación",
  "curso-2": "Clase 2 · Presentaciones",
  "curso-3": "Clase 3 · Verbo být",
  "curso-4": "Clase 4 · Números 0–10",
  "curso-5": "Clase 5 · Jídlo (comida)",
  "curso-6": "Clase 6 · Verbo bydlet",
  "curso-7": "Clase 7 · Rodina (familia)",
};

// [checo, español, pronunciación, ejemplo checo, ejemplo español]
const CS_WORDS = {
  saludos: [
    ["Dobrý den", "buenos días / buen día (formal; se usa todo el día)", "dóbri den", "Dobrý den, jak se máte?", "Buenos días, ¿cómo está?"],
    ["Dobré ráno", "buenos días (por la mañana)", "dóbre ráno", "Dobré ráno, jste připraven?", "Buenos días, ¿está listo?"],
    ["Dobrý večer", "buenas tardes / buenas noches (al llegar)", "dóbri vécher", "Dobrý večer, vítejte.", "Buenas tardes, bienvenido."],
    ["Dobrou noc", "buenas noches (al irse a dormir)", "dóbrou notz", "Dobrou noc, zítra ráno.", "Buenas noches, hasta mañana por la mañana."],
    ["Ahoj", "hola / chao (informal)", "ájoy", "Ahoj, jak se máš?", "Hola, ¿cómo estás?"],
    ["Na shledanou", "adiós (formal)", "na sjledánou", "Na shledanou, hezký den.", "Adiós, que tenga un buen día."],
    ["Prosím", "por favor / de nada / dígame", "prósim", "Děkuji. — Prosím.", "Gracias. — De nada."],
    ["Děkuji", "gracias", "dyékuyi", "Děkuji za pomoc.", "Gracias por la ayuda."],
    ["Promiňte", "disculpe / perdón (formal)", "prómiñte", "Promiňte, kde je metro?", "Disculpe, ¿dónde está el metro?"],
    ["Ano", "sí", "áno", "Ano, rozumím.", "Sí, entiendo."],
    ["Ne", "no", "ne", "Ne, nemluvím česky.", "No, no hablo checo."],
    ["Těší mě", "mucho gusto", "tyéshi mnye", "Těší mě, jmenuji se Víctor.", "Mucho gusto, me llamo Víctor."],
  ],
  numeros: [
    ["jedna", "uno / una", "yédna", "Jedna koruna.", "Una corona."],
    ["dvě", "dos", "dvye", "Dvě piva, prosím.", "Dos cervezas, por favor."],
    ["tři", "tres", "trzhi", "Tři lístky, prosím.", "Tres boletos, por favor."],
    ["čtyři", "cuatro", "chtírzhi", "Čtyři hodiny.", "Cuatro horas."],
    ["pět", "cinco", "pyet", "Pět korun.", "Cinco coronas."],
    ["deset", "diez", "déset", "Deset minut.", "Diez minutos."],
    ["dvacet", "veinte", "dvátzet", "Dvacet korun.", "Veinte coronas."],
    ["sto", "cien", "sto", "Sto korun.", "Cien coronas."],
    ["koruna", "corona (moneda checa, CZK)", "kóruna", "To stojí sto korun.", "Cuesta cien coronas."],
    ["peníze", "dinero", "péniye", "Nemám peníze.", "No tengo dinero."],
    ["karta", "tarjeta", "kárta", "Platím kartou.", "Pago con tarjeta."],
    ["hotově", "en efectivo", "hótovye", "Platím hotově.", "Pago en efectivo."],
    ["účet", "la cuenta / factura", "úchet", "Účet, prosím.", "La cuenta, por favor."],
  ],
  transporte: [
    ["vlak", "tren", "vlak", "Vlak jede v osm.", "El tren sale a las ocho."],
    ["autobus", "autobús", "áutobus", "Autobus je na zastávce.", "El autobús está en la parada."],
    ["metro", "metro", "metro", "Metro je rychlé.", "El metro es rápido."],
    ["tramvaj", "tranvía", "trámvay", "Čekám na tramvaj.", "Estoy esperando el tranvía."],
    ["jízdenka", "boleto / pasaje", "yízdenka", "Chci jednu jízdenku.", "Quiero un boleto."],
    ["nádraží", "estación de tren", "nádrazhí", "Nádraží je blízko.", "La estación está cerca."],
    ["zastávka", "parada", "zastávka", "Kde je zastávka?", "¿Dónde está la parada?"],
    ["letiště", "aeropuerto", "létyishtye", "Jedeme na letiště.", "Vamos al aeropuerto."],
    ["ulice", "calle", "úlitze", "Jaká je to ulice?", "¿Qué calle es esta?"],
    ["náměstí", "plaza", "námnyesti", "Václavské náměstí.", "Plaza de Wenceslao."],
    ["vlevo", "a la izquierda", "vlévo", "Zahněte vlevo.", "Gire a la izquierda."],
    ["vpravo", "a la derecha", "vprávo", "Zahněte vpravo.", "Gire a la derecha."],
    ["rovně", "derecho (seguir recto)", "rovnye", "Jděte rovně.", "Siga derecho."],
    ["kde", "dónde", "gde", "Kde je nádraží?", "¿Dónde está la estación?"],
  ],
  compras: [
    ["obchod", "tienda", "ópjot", "Hledám obchod.", "Estoy buscando una tienda."],
    ["supermarket", "supermercado", "súpermarket", "Supermarket je tady blízko.", "El supermercado queda aquí cerca."],
    ["voda", "agua", "voda", "Vodu, prosím.", "Agua, por favor."],
    ["chléb", "pan", "jlep", "Chléb, prosím.", "Pan, por favor."],
    ["mléko", "leche", "mléko", "Jedno mléko, prosím.", "Una leche, por favor."],
    ["pivo", "cerveza", "pivo", "Jedno pivo, prosím.", "Una cerveza, por favor."],
    ["káva", "café", "káva", "Jednu kávu, prosím.", "Un café, por favor."],
    ["ovoce", "fruta", "óvotze", "Čerstvé ovoce.", "Fruta fresca."],
    ["účtenka", "boleta / ticket", "újtenka", "Účtenku, prosím.", "La boleta, por favor."],
    ["otevřeno", "abierto", "ótevrzheno", "Je otevřeno do šesti.", "Está abierto hasta las seis."],
    ["zavřeno", "cerrado", "závrzheno", "Dnes je zavřeno.", "Hoy está cerrado."],
    ["pokladna", "caja", "pókladna", "Pokladna je vlevo.", "La caja está a la izquierda."],
    ["taška", "bolsa", "tashka", "Tašku, prosím.", "Una bolsa, por favor."],
  ],
  vivienda: [
    ["byt", "departamento", "bit", "Hledám byt.", "Busco un departamento."],
    ["pokoj", "habitación", "pókoi", "Pokoj je velký.", "La habitación es grande."],
    ["nájem", "arriendo / alquiler", "náyem", "Nájem je vysoký.", "El arriendo es alto."],
    ["klíče", "llaves", "klíche", "Tady jsou klíče.", "Aquí están las llaves."],
    ["kuchyň", "cocina", "kujíñ", "Kuchyň je malá.", "La cocina es chica."],
    ["koupelna", "baño (de la casa)", "kópelna", "Koupelna je čistá.", "El baño está limpio."],
    ["postel", "cama", "póstel", "Postel je pohodlná.", "La cama es cómoda."],
    ["wi-fi", "wifi", "vaj-faj", "Heslo na wi-fi, prosím.", "La clave del wifi, por favor."],
    ["záloha", "depósito / garantía", "záloha", "Záloha je jeden nájem.", "El depósito es un mes de arriendo."],
    ["smlouva", "contrato", "smlóva", "Tady je smlouva.", "Aquí está el contrato."],
    ["soused", "vecino", "sóused", "Soused je milý.", "El vecino es amable."],
    ["adresa", "dirección", "ádresa", "Jaká je vaše adresa?", "¿Cuál es su dirección?"],
  ],
  trabajo: [
    ["práce", "trabajo", "prátze", "Hledám práci.", "Estoy buscando trabajo."],
    ["šéf", "jefe", "shef", "Můj šéf se jmenuje Jan.", "Mi jefe se llama Jan."],
    ["kolega", "colega (hombre)", "kólega", "To je můj kolega.", "Este es mi colega."],
    ["kolegyně", "colega (mujer)", "kólegiñe", "To je moje kolegyně.", "Esta es mi colega."],
    ["směna", "turno", "smnyena", "Mám noční směnu.", "Tengo el turno de noche."],
    ["životopis", "currículum", "zhívotopis", "Tady je můj životopis.", "Aquí está mi currículum."],
    ["pohovor", "entrevista de trabajo", "póhovor", "Mám pohovor zítra.", "Tengo una entrevista mañana."],
    ["přestávka", "pausa / descanso", "przhestávka", "Mám přestávku.", "Tengo una pausa."],
    ["plat", "sueldo", "plat", "Jaký je plat?", "¿Cuál es el sueldo?"],
    ["kancelář", "oficina", "kántselarzh", "Kancelář je tady.", "La oficina está aquí."],
    ["dnes", "hoy", "dnes", "Dnes pracuji.", "Hoy trabajo."],
    ["zítra", "mañana (el día)", "zítra", "Zítra začínám.", "Mañana empiezo."],
  ],
  emergencias: [
    ["pomoc", "ayuda", "pómotz", "Pomoc, prosím!", "¡Ayuda, por favor!"],
    ["nemocnice", "hospital", "némoztñitse", "Nemocnice je daleko.", "El hospital queda lejos."],
    ["lékař", "médico", "lékarzh", "Potřebuji lékaře.", "Necesito un médico."],
    ["lékárna", "farmacia", "lékárna", "Kde je lékárna?", "¿Dónde está la farmacia?"],
    ["bolest", "dolor", "bólest", "Mám silnou bolest.", "Tengo un dolor fuerte."],
    ["lék", "medicamento", "lek", "Potřebuji lék.", "Necesito un medicamento."],
    ["pojištění", "seguro (de salud / viaje)", "poyishtyení", "Mám cestovní pojištění.", "Tengo seguro de viaje."],
    ["policie", "policía", "pólitsie", "Zavolejte policii.", "Llame a la policía."],
    ["hasiči", "bomberos", "hásichi", "Zavolejte hasiče.", "Llame a los bomberos."],
    ["sanitka", "ambulancia", "sáñitka", "Zavolejte sanitku.", "Llame una ambulancia."],
    ["alergie", "alergia", "álergie", "Mám alergii.", "Tengo una alergia."],
    ["toaleta", "baño / servicio", "tóaleta", "Kde je toaleta?", "¿Dónde está el baño?"],
  ],
  // Mi curso (Czech Unlocked) — un tema por unidad del Padlet
  "curso-1": [
    ["matka", "madre", "matka", "To je moje matka.", "Esa es mi madre."],
    ["máma", "mamá", "máma", "Máma je doma.", "Mamá está en casa."],
    ["já", "yo", "yá", "Já jsem Víctor.", "Yo soy Víctor."],
    ["vy", "usted / ustedes / vosotros", "vi", "Jak se máte vy?", "¿Cómo está usted?"],
    ["žena", "mujer", "zhena", "Ta žena je učitelka.", "Esa mujer es profesora."],
    ["něco", "algo", "njétso", "Chceš něco k pití?", "¿Quieres algo para beber?"],
    ["zítra", "mañana (el día siguiente)", "zítra", "Zítra jdu do školy.", "Mañana voy a la escuela."],
    ["škola", "escuela", "shkola", "Kde je škola?", "¿Dónde está la escuela?"],
    ["centrum", "centro", "tséntrum", "Bydlím v centru.", "Vivo en el centro."],
    ["hotel", "hotel", "hotel", "Hotel je v centru.", "El hotel está en el centro."],
    ["čokoláda", "chocolate", "chokoláda", "Mám rád čokoládu.", "Me gusta el chocolate."],
    ["chleba", "pan", "jleba", "Chleba je na stole.", "El pan está en la mesa."],
    ["dělám", "(yo) hago / estoy haciendo", "djelám", "Dělám domácí úkol.", "Hago la tarea."],
    ["těší mě", "encantado / mucho gusto", "tyéshi mnye", "Těší mě, jsem Kate.", "Mucho gusto, soy Kate."],
    ["kofola", "Kofola (refresco checo)", "kofola", "Dáš si kofolu?", "¿Quieres una Kofola?"],
    ["smažený sýr", "queso frito (plato checo)", "smažení sír", "Dám si smažený sýr.", "Voy a pedir queso frito."],
    ["knedlíky", "knedlíks (dumplings checos)", "knedlíki", "Guláš s knedlíky.", "Gulash con knedlíks."],
    ["kapr", "carpa (típica de Navidad)", "kapr", "Na Vánoce jíme kapra.", "En Navidad comemos carpa."],
    ["pomlázka", "pomlázka (vara de Pascua)", "pomlázka", "To je pomlázka.", "Eso es una pomlázka."],
    ["Krteček", "el Topito (personaje checo)", "krtéchek", "Krteček je český film.", "El Topito es una película checa."]
  ],
  "curso-2": [
    ["Ahoj", "hola (informal)", "ájoy", "Ahoj, jak se jmenuješ?", "Hola, ¿cómo te llamas?"],
    ["Čau", "hola / chao (muy informal)", "chau", "Čau, jsem Pedro.", "Hola, soy Pedro."],
    ["jak se jmenuješ?", "¿cómo te llamas?", "yak se jmenuyesh", "Ahoj, jak se jmenuješ?", "Hola, ¿cómo te llamas?"],
    ["jmenuju se", "me llamo (forma coloquial de jmenuji se)", "jmenuyu se", "Jmenuju se Víctor.", "Me llamo Víctor."],
    ["jsem", "soy / estoy (yo)", "ysem", "Jsem Kate.", "Soy Kate."],
    ["a ty?", "¿y tú?", "a ti", "Jsem Pedro, a ty?", "Soy Pedro, ¿y tú?"],
    ["odkud jsi?", "¿de dónde eres?", "odkut ysi", "Odkud jsi?", "¿De dónde eres?"],
    ["jsem z…", "soy de…", "ysem z", "Jsem z Chile.", "Soy de Chile."],
    ["co děláš?", "¿qué haces? / ¿a qué te dedicas?", "tso djelásh", "Co děláš v Česku?", "¿Qué haces en Chequia?"],
    ["učitelka", "profesora", "úchitelka", "Jsem učitelka.", "Soy profesora."],
    ["ekonom", "economista", "ekonom", "Já jsem ekonom.", "Yo soy economista."],
    ["Česko", "Chequia / República Checa", "chesko", "Co děláš v Česku?", "¿Qué haces en Chequia?"],
    ["Praha", "Praga", "praha", "Bydlím v Praze.", "Vivo en Praga."],
    ["Brno", "Brno", "brno", "Bydlíš v Brně?", "¿Vives en Brno?"]
  ],
  "curso-3": [
    ["já", "yo", "yá", "Já jsem z Chile.", "Yo soy de Chile."],
    ["ty", "tú", "ti", "Ty jsi z USA.", "Tú eres de Estados Unidos."],
    ["on", "él", "on", "On je z Česka.", "Él es de Chequia."],
    ["ona", "ella", "ona", "Ona je učitelka.", "Ella es profesora."],
    ["to", "eso / ello / eso es", "to", "To je z Belgie.", "Eso es de Bélgica."],
    ["my", "nosotros / nosotras", "mi", "My jsme z Texasu.", "Nosotros somos de Texas."],
    ["vy", "usted / ustedes / vosotros", "vi", "Vy jste z Prahy.", "Ustedes son de Praga."],
    ["oni / ony", "ellos / ellas", "oni / oni", "Oni jsou z Oregonu.", "Ellos son de Oregón."],
    ["já jsem", "yo soy / estoy", "yá ysem", "Já jsem Martin.", "Yo soy Martin."],
    ["ty jsi", "tú eres / estás", "ti ysi", "Ty jsi aktivní.", "Tú eres activo."],
    ["on/ona/to je", "él/ella/eso es o está", "on / ona / to ye", "Ona je dobrá.", "Ella es buena."],
    ["my jsme", "nosotros somos / estamos", "mi ysme", "My jsme v USA.", "Nosotros estamos en Estados Unidos."],
    ["vy jste", "usted es / ustedes son o están", "vi yste", "Vy jste z Kanady.", "Ustedes son de Canadá."],
    ["oni jsou", "ellos son / están", "oni ysou", "Oni jsou z Oregonu.", "Ellos son de Oregón."],
    ["já nejsem", "yo no soy / no estoy", "yá neysem", "Já nejsem z Brna.", "Yo no soy de Brno."],
    ["ty nejsi", "tú no eres / no estás", "ti neysi", "Ty nejsi z Prahy.", "Tú no eres de Praga."],
    ["není", "no es / no está (él, ella, eso)", "není", "To není hotel.", "Eso no es un hotel."],
    ["my nejsme", "nosotros no somos / no estamos", "mi neysme", "My nejsme z USA.", "Nosotros no somos de Estados Unidos."],
    ["vy nejste", "usted no es / ustedes no son", "vi neyste", "Vy nejste z Česka.", "Ustedes no son de Chequia."],
    ["oni nejsou", "ellos no son / no están", "oni neysou", "Oni nejsou doma.", "Ellos no están en casa."]
  ],
  "curso-4": [
    ["nula", "cero", "nula", "To je nula.", "Eso es un cero."],
    ["jedna", "uno / una", "yedna", "Jedna káva, prosím.", "Un café, por favor."],
    ["dva", "dos (forma del curso; también existe dvě)", "dva", "Dva rohlíky, prosím.", "Dos panecillos, por favor."],
    ["tři", "tres", "trzhi", "Tři piva, prosím.", "Tres cervezas, por favor."],
    ["čtyři", "cuatro", "chtírzhi", "Čtyři knedlíky.", "Cuatro knedlíks."],
    ["pět", "cinco", "pyet", "Pět korun.", "Cinco coronas."],
    ["šest", "seis", "shest", "Šest studentů.", "Seis estudiantes."],
    ["sedm", "siete", "sedm", "Sedm dní.", "Siete días."],
    ["osm", "ocho", "osm", "Osm hodin.", "Las ocho / ocho horas."],
    ["devět", "nueve", "devyet", "Devět škol.", "Nueve escuelas."],
    ["deset", "diez", "déset", "Deset korun.", "Diez coronas."]
  ],
  "curso-5": [
    ["jídlo", "comida", "yídlo", "Jídlo je výborné.", "La comida está excelente."],
    ["máš hlad?", "¿tienes hambre?", "másh hlad", "Máš hlad?", "¿Tienes hambre?"],
    ["něco k pití?", "¿algo para beber?", "njétso k pití", "Něco k pití?", "¿Algo para beber?"],
    ["salát", "ensalada", "salát", "Dám si salát.", "Voy a pedirme una ensalada."],
    ["řízek", "milanesa / schnitzel", "rzhízek", "Řízek je typicky český.", "El řízek es típicamente checo."],
    ["chleba", "pan", "jleba", "Chleba a máslo.", "Pan y mantequilla."],
    ["rohlík", "panecillo (rohlík)", "rohlík", "Dva rohlíky, prosím.", "Dos panecillos, por favor."],
    ["ryba", "pescado", "riba", "Dám si rybu.", "Voy a pedirme pescado."],
    ["polévka", "sopa", "polévka", "Polévka je horká.", "La sopa está caliente."],
    ["rýže", "arroz", "rízhe", "Rýže nebo brambory?", "¿Arroz o papas?"],
    ["pizza", "pizza", "pitsa", "Dáte si pizzu?", "¿Van a pedir pizza?"],
    ["steak", "bistec", "stejk", "Já si dám steak.", "Yo voy a pedirme un bistec."],
    ["volské oko", "huevo frito", "volské oko", "Snídaně: volské oko.", "Desayuno: huevo frito."],
    ["kuře", "pollo", "kúrzhe", "Pečené kuře.", "Pollo asado."],
    ["ovoce", "fruta", "ovotse", "Mám rád ovoce.", "Me gusta la fruta."],
    ["hranolky", "papas fritas", "hranolki", "Hranolky k řízku.", "Papas fritas con el řízek."],
    ["brambory", "papas", "brambori", "Brambory nebo rýže?", "¿Papas o arroz?"],
    ["těstoviny", "pasta", "tyestovini", "Dám si těstoviny.", "Voy a pedirme pasta."],
    ["knedlíky", "knedlíks (dumplings checos)", "knedlíki", "Guláš s knedlíky, prosím.", "Gulash con knedlíks, por favor."],
    ["pivo", "cerveza", "pivo", "Jedno pivo, prosím.", "Una cerveza, por favor."],
    ["víno", "vino", "víno", "Červené víno, prosím.", "Vino tinto, por favor."],
    ["voda", "agua", "voda", "Vodu, prosím.", "Agua, por favor."],
    ["limonáda", "limonada", "limonáda", "Dáte si limonádu?", "¿Quiere una limonada?"],
    ["káva", "café", "káva", "Jedna káva, prosím.", "Un café, por favor."],
    ["čaj", "té", "chai", "Čaj s citronem.", "Té con limón."]
  ],
  "curso-6": [
    ["bydlet", "vivir / habitar", "bidlet", "Kde bydlíš?", "¿Dónde vives?"],
    ["já bydlím", "yo vivo", "yá bidlím", "Já bydlím v Brně.", "Yo vivo en Brno."],
    ["ty bydlíš", "tú vives", "ti bidlísh", "Kde bydlíš ty?", "¿Dónde vives tú?"],
    ["on/ona bydlí", "él / ella vive", "on / ona bidlí", "Moje babička bydlí v Praze.", "Mi abuela vive en Praga."],
    ["my bydlíme", "nosotros vivimos", "mi bidlíme", "My bydlíme v Argentině.", "Nosotros vivimos en Argentina."],
    ["vy bydlíte", "usted vive / ustedes viven", "vi bidlíte", "Dobrý den, kde bydlíte?", "Buenos días, ¿dónde vive usted?"],
    ["oni bydlí", "ellos viven", "oni bidlí", "Oni bydlí v Ostravě.", "Ellos viven en Ostrava."],
    ["nebydlím", "no vivo", "nebidlím", "Ne, já nebydlím v Praze.", "No, yo no vivo en Praga."],
    ["kde bydlíš?", "¿dónde vives?", "gde bidlísh", "Kde bydlíš?", "¿Dónde vives?"],
    ["Ostrava", "Ostrava", "ostrava", "Ty bydlíš v Ostravě?", "¿Vives en Ostrava?"]
  ],
  "curso-7": [
    ["rodina", "familia", "rodina", "To je moje rodina.", "Esta es mi familia."],
    ["máma / maminka", "mamá", "máma / maminka", "To je moje máma.", "Esta es mi mamá."],
    ["táta / tatínek", "papá", "táta / tatínek", "Můj táta bydlí v Praze.", "Mi papá vive en Praga."],
    ["babička", "abuela", "bábichka", "Moje babička bydlí v Praze.", "Mi abuela vive en Praga."],
    ["děda / dědeček", "abuelo", "dyéda / dyédechek", "To je můj dědeček.", "Este es mi abuelo."],
    ["sestra", "hermana", "sestra", "Kde bydlí tvoje sestra?", "¿Dónde vive tu hermana?"],
    ["bratr", "hermano", "bratr", "Mám bratra.", "Tengo un hermano."],
    ["strýc / strejda", "tío", "stríts / streida", "To je můj strýc.", "Este es mi tío."],
    ["teta", "tía", "teta", "Moje teta bydlí v Brně.", "Mi tía vive en Brno."],
    ["sestřenice", "prima", "sestrzheñitse", "To je moje sestřenice.", "Esta es mi prima."],
    ["rodiče", "padres", "ródiche", "Moji rodiče bydlí v Chile.", "Mis padres viven en Chile."],
    ["děti", "hijos / niños", "dyeti", "Mají dvě děti.", "Tienen dos hijos."]
  ]
,
};

// [checo, español, pronunciación]
const CS_SENTS = {
  saludos: [
    ["Dobrý den, jmenuji se Víctor.", "Buenos días, me llamo Víctor.", "dóbri den, yménuyi se Víktor"],
    ["Těší mě.", "Mucho gusto.", "tyéshi mnye"],
    ["Jak se máte?", "¿Cómo está usted?", "yak se máte"],
    ["Nerozumím. Mluvíte anglicky?", "No entiendo. ¿Habla inglés?", "nérozumím. mlúvíte ánglitzki"],
    ["Můžete to zopakovat, prosím?", "¿Puede repetirlo, por favor?", "múzhete to zópakovat, prósim"],
    ["Můžete mluvit pomaleji, prosím?", "¿Puede hablar más despacio, por favor?", "múzhete mlúvit pómaleji, prósim"],
  ],
  numeros: [
    ["Kolik to stojí?", "¿Cuánto cuesta?", "kólik to stóyi"],
    ["Můžu platit kartou?", "¿Puedo pagar con tarjeta?", "múzhu plátit kártou"],
    ["Platím hotově.", "Pago en efectivo.", "plátim hótovye"],
    ["Účet, prosím.", "La cuenta, por favor.", "úchet, prósim"],
    ["Je to moc drahé.", "Es demasiado caro.", "ye to motz dráhe"],
    ["Máte slevu?", "¿Tienen descuento?", "máte slévu"],
  ],
  transporte: [
    ["Kde je nádraží, prosím?", "¿Dónde está la estación, por favor?", "gde ye nádrazhí, prósim"],
    ["Jednu jízdenku, prosím.", "Un boleto, por favor.", "yédnu yízdenku, prósim"],
    ["Jak se dostanu na letiště?", "¿Cómo llego al aeropuerto?", "yak se dóstanu na létyishtye"],
    ["Musím vystoupit tady?", "¿Tengo que bajarme aquí?", "músím vístoupit tádi"],
    ["Je to daleko pěšky?", "¿Queda lejos a pie?", "ye to dáleko pyeshki"],
    ["Zahněte vlevo a pak rovně.", "Gire a la izquierda y luego siga derecho.", "záhñete vlévo a pak rovnye"],
  ],
  compras: [
    ["Hledám supermarket.", "Estoy buscando un supermercado.", "hlédám súpermarket"],
    ["Máte vodu, prosím?", "¿Tienen agua, por favor?", "máte vodu, prósim"],
    ["Jedno pivo, prosím.", "Una cerveza, por favor.", "yédno pivo, prósim"],
    ["Účtenku, prosím.", "La boleta, por favor.", "újtenku, prósim"],
    ["Je otevřeno?", "¿Está abierto?", "ye ótevrzheno"],
    ["Kde je pokladna?", "¿Dónde está la caja?", "gde ye pókladna"],
  ],
  vivienda: [
    ["Hledám byt k pronájmu.", "Busco un departamento en arriendo.", "hlédám bit k pronáymu"],
    ["Kolik je nájem?", "¿Cuánto es el arriendo?", "kólik ye náyem"],
    ["Je tu wi-fi?", "¿Hay wifi?", "ye tu vaj-faj"],
    ["Kde jsou klíče?", "¿Dónde están las llaves?", "gde ysou klíche"],
    ["Kdy se mohu nastěhovat?", "¿Cuándo me puedo mudar?", "gdi se móhu nástyehovat"],
    ["Je pokoj ještě volný?", "¿La habitación sigue disponible?", "ye pókoi yéshte volní"],
  ],
  trabajo: [
    ["Dnes je můj první den v práci.", "Hoy es mi primer día de trabajo.", "dnes ye muy prvñí den f prátzi"],
    ["Kde je můj šéf?", "¿Dónde está mi jefe?", "gde ye muy shef"],
    ["V kolik hodin začínám?", "¿A qué hora empiezo?", "f kólik hódin záchínám"],
    ["Pracuji od osmi do čtyř.", "Trabajo de ocho a cuatro.", "prátsuyi od osmi do chtířzh"],
    ["Můžu si vzít přestávku?", "¿Puedo tomar una pausa?", "múzhu si vzít przhestávku"],
    ["Promiňte, přijdu pozdě.", "Disculpe, voy a llegar tarde.", "prómiñte, przhiydu pozdye"],
  ],
  emergencias: [
    ["Pomoc!", "¡Ayuda!", "pómotz"],
    ["Potřebuji lékaře.", "Necesito un médico.", "pótrzhébuyi lékarzhe"],
    ["Kde je nejbližší nemocnice?", "¿Dónde está el hospital más cercano?", "gde ye néyblishshí némoztñitse"],
    ["Bolí mě hlava.", "Me duele la cabeza.", "bóli mnye hlava"],
    ["Zavolejte sanitku, prosím.", "Llame una ambulancia, por favor.", "závoleyte sáñitku, prósim"],
    ["Mám cestovní pojištění.", "Tengo seguro de viaje.", "mam tséstovñí poyishtyení"],
    ["Kde je toaleta?", "¿Dónde está el baño?", "gde ye tóaleta"],
  ],
  // Mi curso (Czech Unlocked)
  "curso-1": [
    ["Těší mě!", "¡Mucho gusto!", "tyéshi mnye"],
    ["Zítra jdu do školy.", "Mañana voy a la escuela.", "zítra ydu do shkoli"],
    ["Dělám domácí úkol.", "Hago la tarea.", "djelám domátsí úkol"],
    ["Chleba je na stole.", "El pan está en la mesa.", "jleba ye na stole"],
    ["To je čokoláda.", "Eso es chocolate.", "to ye chokoláda"]
  ],
  "curso-2": [
    ["Ahoj, jak se jmenuješ?", "Hola, ¿cómo te llamas?", "ájoy, yak se jmenuyesh"],
    ["Čau, jsem Pedro a ty?", "Hola, soy Pedro, ¿y tú?", "chau, ysem pedro a ti"],
    ["Já jsem Kate, těší mě!", "Yo soy Kate, ¡mucho gusto!", "yá ysem kate, tyéshi mnye"],
    ["Odkud jsi?", "¿De dónde eres?", "odkut ysi"],
    ["Z USA, odkud jsi ty?", "De Estados Unidos, ¿y tú de dónde eres?", "z ú-es-á, odkut ysi ti"],
    ["Já z Mexika. Co děláš v Česku?", "Yo de México. ¿Qué haces en Chequia?", "yá z meksika. tso djelásh f chesku"],
    ["Jsem učitelka a ty?", "Soy profesora, ¿y tú?", "ysem úchitelka a ti"],
    ["Já jsem ekonom.", "Yo soy economista.", "yá ysem ekonom"],
    ["A taky bydlíš v Brně?", "¿Y tú también vives en Brno?", "a taki bidlísh v brnye"],
    ["Ne, bydlím v Praze.", "No, vivo en Praga.", "ne, bidlím v praze"],
    ["Jmenuju se Víctor.", "Me llamo Víctor.", "jmenuyu se víktor"],
    ["Jsem z Chile.", "Soy de Chile.", "ysem z chile"]
  ],
  "curso-3": [
    ["Já jsem z Kanady.", "Yo soy de Canadá.", "yá ysem z kanadi"],
    ["Ty jsi z USA.", "Tú eres de Estados Unidos.", "ti ysi z ú-es-á"],
    ["On je z Česka.", "Él es de Chequia.", "on ye z cheska"],
    ["Ona je z Francie.", "Ella es de Francia.", "ona ye z frantsiye"],
    ["To je z Belgie.", "Eso es de Bélgica.", "to ye z belgiye"],
    ["My jsme z Texasu.", "Nosotros somos de Texas.", "mi ysme z texasu"],
    ["Vy jste ze Severní Karolíny.", "Ustedes son de Carolina del Norte.", "vi yste ze severñí karolíni"],
    ["Oni jsou z Oregonu.", "Ellos son de Oregón.", "oni ysou z oregonu"],
    ["Já jsem Martin.", "Yo soy Martin.", "yá ysem martin"],
    ["Ona je dobrá.", "Ella es buena.", "ona ye dobrá"],
    ["Já nejsem z Brna.", "Yo no soy de Brno.", "yá neysem z brna"],
    ["To není hotel.", "Eso no es un hotel.", "to není hotel"]
  ],
  "curso-4": [
    ["Jedna káva, prosím.", "Un café, por favor.", "yedna káva, prósim"],
    ["Dva rohlíky, prosím.", "Dos panecillos, por favor.", "dva rohlíki, prósim"],
    ["Tři piva, prosím.", "Tres cervezas, por favor.", "trzhi piva, prósim"],
    ["To je nula.", "Eso es un cero.", "to ye nula"],
    ["Deset korun.", "Diez coronas.", "déset kórun"]
  ],
  "curso-5": [
    ["Máš hlad?", "¿Tienes hambre?", "másh hlad"],
    ["Něco k pití?", "¿Algo para beber?", "njétso k pití"],
    ["Jedno pivo, prosím.", "Una cerveza, por favor.", "yedno pivo, prósim"],
    ["Jedna káva, prosím.", "Un café, por favor.", "yedna káva, prósim"],
    ["Dám si řízek s hranolky.", "Voy a pedirme řízek con papas fritas.", "dám si rzhízek s hranolki"],
    ["Guláš s knedlíky, prosím.", "Gulash con knedlíks, por favor.", "gulásh s knedlíki, prósim"],
    ["Vodu, prosím.", "Agua, por favor.", "vodu, prósim"]
  ],
  "curso-6": [
    ["Já bydlím v Brně.", "Yo vivo en Brno.", "yá bidlím v brnye"],
    ["Kde bydlíš ty?", "¿Dónde vives tú?", "gde bidlísh ti"],
    ["Moje babička bydlí v Praze.", "Mi abuela vive en Praga.", "moye bábichka bidlí v praze"],
    ["Kde bydlí tvoje sestra?", "¿Dónde vive tu hermana?", "gde bidlí tvoye sestra"],
    ["Dobrý den, kde bydlíte?", "Buenos días, ¿dónde vive usted?", "dóbri den, gde bidlíte"],
    ["Ahoj, ty bydlíš v Ostravě?", "Hola, ¿tú vives en Ostrava?", "ájoy, ti bidlísh v ostravye"],
    ["Ne, já nebydlím v Praze.", "No, yo no vivo en Praga.", "ne, yá nebidlím v praze"],
    ["Bydlím v Praze.", "Vivo en Praga.", "bidlím v praze"]
  ],
  "curso-7": [
    ["To je moje rodina.", "Esta es mi familia.", "to ye moye rodina"],
    ["To je moje máma.", "Esta es mi mamá.", "to ye moye máma"],
    ["To je můj táta.", "Este es mi papá.", "to ye muy táta"],
    ["To je moje babička.", "Esta es mi abuela.", "to ye moye bábichka"],
    ["To je můj dědeček.", "Este es mi abuelo.", "to ye muy dyédechek"],
    ["Mám bratra a sestru.", "Tengo un hermano y una hermana.", "mám bratra a sestru"],
    ["Moji rodiče bydlí v Chile.", "Mis padres viven en Chile.", "moyi ródiche bidlí v chile"]
  ]
,
};

const CS_ALL_WORDS = [];
const CS_ALL_SENTS = [];
CS_THEMES.forEach((t) => {
  CS_WORDS[t].forEach((w, i) => CS_ALL_WORDS.push({ id: `cs-${t}-${i}`, lvl: "A1", th: t, en: w[0], es: w[1], pron: w[2], ex: w[3], exes: w[4] }));
  CS_SENTS[t].forEach((s, i) => CS_ALL_SENTS.push({ id: `cs-${t}-${i}`, lvl: "A1", th: t, en: s[0], es: s[1], pron: s[2] }));
});
