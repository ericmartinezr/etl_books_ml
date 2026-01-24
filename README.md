- Crear proyecto (books-ml)
- Crear repositorio en Dataform
- Crear cuenta de servicio o usar la por defecto
- Asignar roles/bigquery.jobUser a la cuenta por defecto
  - roles/dataform.admin
  - roles/dataform.editor
  - roles/secretmanager.secretAccessor
- Dar

https://docs.cloud.google.com/dataform/docs/connect-repository#github
https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

sin passphrase

---

eval `ssh-agent -s`
ssh-agent

---

ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAII7k3b5UneaEgjoxoxbs15um2cTouaXqQZRvuhP+I6b8 eric.martinez@live.cl

-- Crear secreto en GCP, asociar a cuenta de servicio de dataform

--- Variables comunes

export PROJECT_ID="books-ml"
export REGION="us-central1"
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
BQ_DATASET_BRZ="ds_books_bronze"
BQ_DATASET_SLV="ds_books_silver"
BQ_DATASET_GLD="ds_books_gold"

--- Crear una cuenta de servicio para Cloud Build

```sh
gcloud iam service-accounts create dataform-app-sa \
  --description="Cuenta de servicio para Dataform"

SA_EMAIL_DF="dataform-app-sa@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${SA_EMAIL_DF}" --role="roles/bigquery.jobUser"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${SA_EMAIL_DF}" --role="roles/dataform.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${SA_EMAIL_DF}" --role="roles/dataform.editor"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${SA_EMAIL_DF}" --role="roles/secretmanager.secretAccessor"
```

-- Crear datasets

bq mk --dataset --location=$REGION $PROJECT_ID:$BQ_DATASET_BRZ
bq mk --dataset --location=$REGION $PROJECT_ID:$BQ_DATASET_SLV
bq mk --dataset --location=$REGION $PROJECT_ID:$BQ_DATASET_GLD

-- Habilitar APIs necesarias

```bash
gcloud services enable \
    cloudbuild.googleapis.com \
    compute.googleapis.com \
    storage.googleapis.com \
    secretmanager.googleapis.com \
	dataform.googleapis.com
```

-- Crear bucket

BUCKET_NAME="books-ml-input"

gcloud storage buckets create gs://${BUCKET_NAME} \
    --location=$REGION \
 --uniform-bucket-level-access
-- Copiar archivo al bucket (desde cloudbuild)

- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  id: 'copy-books'
  entrypoint: 'gsutil'
  args: ['cp', 'libros.avro', '${_INPUT_LOCATION}/libros.avro']
  waitFor: ['tests']

-- Crear repositorio y workspace Dataform

```sh
gcloud dataform repositories create "books-repo" --location=$REGION --service-account="dataform-app-sa@${PROJECT_ID}.iam.gserviceaccount.com"
gcloud dataform repositories workspaces create "books-repo-workspace" --repository="books-repo" --location=$REGION

```

Referencia
https://docs.cloud.google.com/dataform/docs/use-dataform-cli#before_you_begin
