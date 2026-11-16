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
const CS_THEMES = ["saludos", "numeros", "transporte", "compras", "vivienda", "trabajo", "emergencias"];
const CS_TH_LABEL = {
  saludos: "Saludos y cortesía",
  numeros: "Números y dinero",
  transporte: "Transporte y ciudad",
  compras: "Compras y supermercado",
  vivienda: "Vivienda / arriendo",
  trabajo: "Trabajo (primer día)",
  emergencias: "Emergencias y salud",
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
};

const CS_ALL_WORDS = [];
const CS_ALL_SENTS = [];
CS_THEMES.forEach((t) => {
  CS_WORDS[t].forEach((w, i) => CS_ALL_WORDS.push({ id: `cs-${t}-${i}`, lvl: "A1", th: t, en: w[0], es: w[1], pron: w[2], ex: w[3], exes: w[4] }));
  CS_SENTS[t].forEach((s, i) => CS_ALL_SENTS.push({ id: `cs-${t}-${i}`, lvl: "A1", th: t, en: s[0], es: s[1], pron: s[2] }));
});
