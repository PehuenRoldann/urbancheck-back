#!/bin/sh
set -e

# Configurar alias local para MinIO (API corriendo en el contenedor)
mc alias set local http://localhost:9000 minio minio123

# Crear bucket si no existe
mc mb --ignore-existing local/urbancheck

# Aplicar política personalizada (lectura + escritura anónima)
mc anonymous set-json /init/urbancheck-policy.json local/urbancheck

echo "✅ Bucket 'urbancheck' creado y configurado como público (lectura + escritura)."
