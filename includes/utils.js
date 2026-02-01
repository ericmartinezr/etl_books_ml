// Funcion para convertir las fechas de las opiniones de los usuarios
// Actualmente están escritas como "Martes 30 de Abril, 2025"
// Las convierte a 2025-04-30
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

// Funcion para convertir el esquema segun el ambiente (dev o prod)
function schema(name) {
  const env = dataform.projectConfig.vars.env;
  // Si es "dev" le agrega el sufijo "_dev"
  // Si es "prod" queda sin sufijo
  return env === 'prod' ? `ds_books_${name}` : `ds_books_${name}_dev`;
}

module.exports = { convertDate, schema };
