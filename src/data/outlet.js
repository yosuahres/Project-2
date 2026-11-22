export const outlet = {
  name: 'Indah Puri',
  address:
    'Jalan Ir. Sutami, Sekupang, Patam Lestari, Kec. Sekupang, Kota Batam, Kepulauan Riau 29424',
  phone: '+6281363315569',
  mapsUrl: 'https://maps.app.goo.gl/tmX3jqhw1aKVBe5M7',
  // Index 0 = Sunday, matching Date.prototype.getDay().
  hours: Array.from({ length: 7 }, () => ({ open: '06:00', close: '19:00' })),
}

export const formatHours = ({ open, close }) => `${open}-${close}`

export const getTodayHours = (date = new Date()) => outlet.hours[date.getDay()]
