// The outlet as it stood before it moved to Supabase. Like the bundled menu, it is shown only
// when the app runs without Supabase settings; the live details are edited in /admin.
export const outlet = {
  name: 'Indah Puri',
  address:
    'Jalan Ir. Sutami, Sekupang, Patam Lestari, Kec. Sekupang, Kota Batam, Kepulauan Riau 29424',
  phone: '+6281363315569',
  mapsUrl: 'https://maps.app.goo.gl/tmX3jqhw1aKVBe5M7',
  // Index 0 = Sunday, matching Date.prototype.getDay().
  hours: Array.from({ length: 7 }, () => ({ open: '06:00', close: '19:00' })),
}
