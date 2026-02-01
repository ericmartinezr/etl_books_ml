WITH user_input AS (
  SELECT embedding
  FROM AI.GENERATE_EMBEDDING(
    -- Quitar "_dev" si se ejecuta con data productiva
    MODEL `books-ml.ds_books_gold_dev.dev_vertex_ai_books_endpoint`,
    (SELECT CAST(@search_query AS STRING) AS content),
    STRUCT('RETRIEVAL_QUERY' AS task_type, 1024 AS output_dimensionality)
  )
)
SELECT
  base.title,
  base.resena,
  base.isbn13,
  (1 - distance) * 100 AS similarity_score
FROM
  VECTOR_SEARCH(
    -- Quitar "_dev" si se ejecuta con data productiva
    TABLE `books-ml.ds_books_gold_dev.dev_ml_books_model`,
    'embedding',
    TABLE user_input,
    top_k => 10,
    options => '{"fraction_lists_to_search": 0.5}'
  )
ORDER BY similarity_score DESC