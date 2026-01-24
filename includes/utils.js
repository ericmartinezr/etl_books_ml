function convertDate(column) {
  const months = {
    Enero: '01',
    Febrero: '02',
    Marzo: '03',
    Abril: '04',
    Mayo: '05',
    Junio: '06',
    Julio: '07',
    Agosto: '08',
    Septiembre: '09',
    Octubre: '10',
    Noviembre: '11',
    Diciembre: '12',
  };

  let formattedCol = column;
  for (const [spanish, num] of Object.entries(months)) {
    formattedCol = `REPLACE(${formattedCol}, '${spanish}', '${num}')`;
  }

  return `PARSE_DATE('%u %d de %m, %Y', ${formattedCol})`;
}
module.exports = { convertDate };
