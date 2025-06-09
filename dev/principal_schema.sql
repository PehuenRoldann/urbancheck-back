CREATE SCHEMA IF NOT EXISTS urbancheck_back;
SET search_path TO urbancheck_back;

-- ENUMS
CREATE TYPE role_enum AS ENUM (
  'Operador de Atención al vecino',
  'Ciudadano',
  'Responsable de dependencia',
  'Miembro de cuadrilla'
);

CREATE TYPE municipal_dependency_enum AS ENUM (
  'Arboldado urbano',
  'Alumbrado público',
  'Mantenimiento de cloaca y agua potable',
  'Recolección de residuos',
  'Liempieza de calles',
  'Distribución de reigo y agua potable',
  'Control urbano y de tránsito',
  'Vehículos abandonados',
  'Conservación de espacios públicos',
  'Atención sanitaria de animales',
  'Control industrial y de plagas'
);

CREATE TYPE priority_level_enum AS ENUM ('Muy Alta', 'Alta', 'Media', 'Baja');

CREATE TYPE ticket_status_enum AS ENUM (
  'Pendiente', 'Válido', 'Programada', 'Resuelto',
  'Finalizado', 'Cuestionada', 'Rechazado', 'Derivado', 'Cancelado'
);

-- TABLES

CREATE TABLE dependency (
  id SERIAL PRIMARY KEY,
  name municipal_dependency_enum NOT NULL,
  is_operating BOOLEAN DEFAULT false
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  description role_enum NOT NULL
);

CREATE TABLE user_account (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider_id UUID NOT NULL UNIQUE,
  dni BIGINT NOT NULL,
  email TEXT NOT NULL,
  email_alt TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  postal_code INT DEFAULT NULL,
  street TEXT DEFAULT NULL,
  street_number INT DEFAULT NULL,
  is_resident BOOLEAN DEFAULT true,
  role_id INT REFERENCES role(id) NOT NULL,
  its TIMESTAMP DEFAULT now(),
  uts TIMESTAMP DEFAULT NULL,
  dts TIMESTAMP DEFAULT NULL
);

CREATE TABLE works_at (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_account(id),
  dependency_id INT NOT NULL REFERENCES dependency(id),
  started DATE,
  ended DATE
);

CREATE TABLE penalty_type (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE penalty (
  id SERIAL PRIMARY KEY,
  description INT REFERENCES penalty_type(id),
  date TIMESTAMP NOT NULL,
  user_id UUID REFERENCES user_account(id)
);

CREATE TABLE ticket_status (
  id SERIAL PRIMARY KEY,
  description ticket_status_enum NOT NULL UNIQUE
);

CREATE TABLE priority (
  id SERIAL PRIMARY KEY,
  description priority_level_enum NOT NULL
);

CREATE TABLE issue (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  code TEXT NOT NULL,
  enabled BOOLEAN NOT NULL
);

CREATE TABLE problematica (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  code TEXT NOT NULL,
  enabled BOOLEAN NOT NULL,
  dependency_id INT REFERENCES dependency(id)
);

CREATE TABLE ticket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description VARCHAR(250),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  timestamp TIMESTAMP NOT NULL,
  created_by UUID REFERENCES user_account(id),
  modified_by UUID REFERENCES user_account(id),
  image_url TEXT,
  status_id INT REFERENCES ticket_status(id),
  priority_id INT REFERENCES priority(id),
  issue_id INT REFERENCES issue(id),
  its TIMESTAMP WITH TIME ZONE DEFAULT now(),
  uts TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  dts TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE subscription (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_account(id),
  ticket_id UUID REFERENCES ticket(id),
  its TIMESTAMP WITH TIME ZONE DEFAULT now(),
  dts TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE status_history (
  id SERIAL PRIMARY KEY,
  author_id UUID REFERENCES user_account(id),
  ticket_id UUID REFERENCES ticket(id),
  status_id INT REFERENCES ticket_status(id),
  its TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE priority_history (
  id SERIAL PRIMARY KEY,
  author_id UUID REFERENCES user_account(id),
  ticket_id UUID REFERENCES ticket(id),
  priority_id INT REFERENCES priority(id),
  its TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Función reutilizable para actualizar el campo uts
CREATE OR REPLACE FUNCTION set_uts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.uts = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER set_uts_on_user_update
BEFORE UPDATE ON urbancheck_back.user_account
FOR EACH ROW EXECUTE FUNCTION set_uts_timestamp();

CREATE TRIGGER set_uts_on_ticket_update
BEFORE UPDATE ON urbancheck_back.ticket
FOR EACH ROW EXECUTE FUNCTION set_uts_timestamp();

-- Inserts

-- Municipal dependencies
INSERT INTO dependency (name) VALUES
  ('Arboldado urbano'),
  ('Alumbrado público'),
  ('Mantenimiento de cloaca y agua potable'),
  ('Recolección de residuos'),
  ('Liempieza de calles'),
  ('Distribución de reigo y agua potable'),
  ('Control urbano y de tránsito'),
  ('Vehículos abandonados'),
  ('Conservación de espacios públicos'),
  ('Atención sanitaria de animales'),
  ('Control industrial y de plagas');

-- Roles
INSERT INTO role (description) VALUES
  ('Operador de Atención al vecino'),
  ('Ciudadano'),
  ('Responsable de dependencia'),
  ('Miembro de cuadrilla');

-- Ticket statuses
INSERT INTO ticket_status (description) VALUES
  ('Pendiente'),
  ('Válido'),
  ('Programada'),
  ('Resuelto'),
  ('Finalizado'),
  ('Cuestionada'),
  ('Rechazado'),
  ('Derivado'),
  ('Cancelado');

-- Prioridades
INSERT INTO priority (description) VALUES
  ('Muy Alta'),
  ('Alta'),
  ('Media'),
  ('Baja');
