CREATE SCHEMA IF NOT EXISTS urbancheck_back;
SET search_path TO urbancheck_back;

-- ENUMS
CREATE TYPE role_enum AS ENUM ('Operador de Atención al vecino', 'Ciudadano', 'Responsable de dependencia', 'Miembro de cuadrilla');

CREATE TYPE municipal_dependency_enum AS ENUM (
  'Arbolado', 'AreasVerdes', 'Barrido', 'ConservacionDeCalles', 'Electrotecnia',
  'EspaciosPúblicos', 'Microbasurales', 'ObrasPrivadas', 'ObrasPúblicas',
  'OficinaTecnicaDeObrasSanitarias', 'PolicíaMunicipal', 'Recolección',
  'RedDeAgua', 'RedDeCloacas', 'Riego', 'SaludAmbiental', 'Tránsito'
);

CREATE TYPE priority_level_enum AS ENUM ('Muy Alta', 'Alta', 'Media', 'Baja');

-- TABLES
CREATE TABLE role (
  id UUID PRIMARY KEY,
  description role_enum NOT NULL
);

CREATE TABLE dependency (
  id UUID PRIMARY KEY,
  description TEXT NOT NULL,
  name municipal_dependency_enum NOT NULL
);

CREATE TABLE user_account (
  id UUID PRIMARY KEY,
  dni BIGINT NOT NULL,
  email TEXT NOT NULL,
  email_alt TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  postal_code INT NOT NULL,
  street TEXT NOT NULL,
  street_number INT NOT NULL,
  role_id UUID REFERENCES role(id),
  dependency_id UUID REFERENCES dependency(id)
);

CREATE TABLE penalty_type (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE penalty (
  id UUID PRIMARY KEY,
  description UUID REFERENCES penalty_type(id),
  date TIMESTAMP NOT NULL,
  user_id UUID REFERENCES user_account(id)
);

CREATE TABLE subscription (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_account(id)
);

CREATE TABLE ticket_status (
  id UUID PRIMARY KEY,
  description TEXT NOT NULL
);

CREATE TABLE priority (
  id UUID PRIMARY KEY,
  description TEXT NOT NULL
);

CREATE TABLE issue (
  id UUID PRIMARY KEY,
  description TEXT NOT NULL,
  code TEXT NOT NULL,
  enabled BOOLEAN NOT NULL
);

CREATE TABLE ticket (
  id UUID PRIMARY KEY,
  description VARCHAR(250),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  timestamp TIMESTAMP NOT NULL,
  created_by UUID REFERENCES user_account(id),
  modified_by UUID REFERENCES user_account(id),
  image_url TEXT,
  status_id UUID REFERENCES ticket_status(id),
  priority_id UUID REFERENCES priority(id),
  issue_id UUID REFERENCES issue(id)
);

CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP NOT NULL,
  author_id UUID REFERENCES user_account(id),
  ticket_id UUID REFERENCES ticket(id),
  status_id UUID REFERENCES ticket_status(id)
);

CREATE TABLE priority_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP NOT NULL,
  author_id UUID REFERENCES user_account(id),
  ticket_id UUID REFERENCES ticket(id),
  priority_id UUID REFERENCES priority(id)
);
