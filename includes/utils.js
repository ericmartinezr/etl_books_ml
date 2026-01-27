/*function convertDate(column) {
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
*/

function convertDate(column) {
  return `
    PARSE_DATE('%d-%m-%Y', 
      REGEXP_REPLACE(
        REGEXP_REPLACE(${column}, r'^[a-zA-ZáéíóúÁÉÍÓÚ]+ ', ''),
        r'(\\d+) de ([a-zA-Z]+), (\\d+)', 
        r'\\1-' || 
        CASE 
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'enero' THEN '01'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'febrero' THEN '02'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'marzo' THEN '03'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'abril' THEN '04'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'mayo' THEN '05'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'junio' THEN '06'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'julio' THEN '07'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'agosto' THEN '08'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'septiembre' THEN '09'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'octubre' THEN '10'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'noviembre' THEN '11'
          WHEN LOWER(REGEXP_EXTRACT(${column}, r'de ([a-zA-Z]+),')) = 'diciembre' THEN '12'
        END
        || r'-\\3'
      )
    )
  `;
}

module.exports = { convertDate };
