

const shifts = {
    morning: {
        start: '08:00',
        end: '16:00'
    },
    afternoon: {
        start: '16:00',
        end: '24:00'
    }
}

const notifications = {
    holiday: 'holidays',
    ausencia: 'ausencia'
}

const legislacion = {
    sallary: 10,
    multiplicadorhorasExtra: 1.5,
    maxhorasExtraAnual: 80,
    descansoEntreJornadas: 12,
    periodoPrueba: 30,
    maximoHorasOrdinariasDia: 9,
    minHorasDescansoIninterrumpido: 36,
    indemnizacionDespidoImprocedente: 33,
    maximoMesesIndemnizacionDespidoImprocedente: 24,
    indemnizacionDespidoProcedente: 20,
    maximoMesesIndemnizacionDespidoProcedente:12,
    tipoIRPF: 2,
    cotizacionSeguridadSocialTrabajador: 6.4
}

const workEvents = {
    checkin: 'checkin',
    checkout: 'checkout'
}

const API_ENDPOINT = 'http://localhost:3000';

module.exports = {
    shifts,
    notifications,
    legislacion,
    workEvents,
    API_ENDPOINT
}



