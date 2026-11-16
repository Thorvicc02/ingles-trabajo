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
