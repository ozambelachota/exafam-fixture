-- =====================================================
-- EXAFAM Tournament Management System - Database Schema
-- =====================================================
-- Description: Complete database schema for managing sports tournaments,
--              including championships, teams, fixtures, results, and sanctions
-- Version: 1.0
-- Created: 2025-02-08
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Championships/Tournaments
CREATE TABLE IF NOT EXISTS public.campeonato (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre_campeonato TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT campeonato_nombre_not_empty CHECK (LENGTH(TRIM(nombre_campeonato)) > 0)
);

COMMENT ON TABLE public.campeonato IS 'Campeonatos/torneos deportivos';
COMMENT ON COLUMN public.campeonato.nombre_campeonato IS 'Nombre del campeonato';
COMMENT ON COLUMN public.campeonato.user_id IS 'Usuario creador del campeonato';

-- Groups for organizing teams
CREATE TABLE IF NOT EXISTS public.grupos_promociones (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre_grupo TEXT NOT NULL,
    CONSTRAINT grupos_nombre_not_empty CHECK (LENGTH(TRIM(nombre_grupo)) > 0)
);

COMMENT ON TABLE public.grupos_promociones IS 'Grupos para organizar equipos/promociones';
COMMENT ON COLUMN public.grupos_promociones.nombre_grupo IS 'Nombre del grupo (ej: Grupo A, Grupo B)';

-- Participating teams/promotions
CREATE TABLE IF NOT EXISTS public.promocion_participante (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre_promocion TEXT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    campeonato_id BIGINT REFERENCES public.campeonato(id) ON DELETE RESTRICT,
    grupo_id BIGINT REFERENCES public.grupos_promociones(id) ON DELETE RESTRICT,
    tipo_id BIGINT,
    CONSTRAINT promocion_nombre_not_empty CHECK (LENGTH(TRIM(nombre_promocion)) > 0)
);

COMMENT ON TABLE public.promocion_participante IS 'Equipos/promociones participantes en el campeonato';
COMMENT ON COLUMN public.promocion_participante.nombre_promocion IS 'Nombre del equipo/promoción';
COMMENT ON COLUMN public.promocion_participante.estado IS 'Estado activo/inactivo del equipo';
COMMENT ON COLUMN public.promocion_participante.tipo_id IS 'Tipo de deporte (referencia externa)';

-- Individual players in teams
CREATE TABLE IF NOT EXISTS public.promocionales (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre_promocional TEXT NOT NULL,
    id_promocion_participante BIGINT NOT NULL REFERENCES public.promocion_participante(id) ON UPDATE CASCADE ON DELETE CASCADE,
    n_goles INTEGER DEFAULT 0,
    CONSTRAINT promocionales_nombre_not_empty CHECK (LENGTH(TRIM(nombre_promocional)) > 0),
    CONSTRAINT promocionales_goles_positive CHECK (n_goles >= 0)
);

COMMENT ON TABLE public.promocionales IS 'Jugadores individuales inscritos en equipos';
COMMENT ON COLUMN public.promocionales.nombre_promocional IS 'Nombre del jugador';
COMMENT ON COLUMN public.promocionales.n_goles IS 'Número de goles anotados';

-- =====================================================
-- MATCH MANAGEMENT TABLES
-- =====================================================

-- Match fixtures/schedule
CREATE TABLE IF NOT EXISTS public.fixture_exafam (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    promocion TEXT NOT NULL,
    vs_promocion TEXT NOT NULL,
    fecha_partido TIMESTAMPTZ,
    campo_id BIGINT,
    grupo_id BIGINT NOT NULL REFERENCES public.grupos_promociones(id) ON DELETE CASCADE,
    n_fecha_jugada BIGINT NOT NULL,
    deporte_id BIGINT,
    por_jugar BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fixture_promociones_different CHECK (promocion != vs_promocion),
    CONSTRAINT fixture_fecha_positive CHECK (n_fecha_jugada > 0)
);

COMMENT ON TABLE public.fixture_exafam IS 'Calendario de partidos/fixtures';
COMMENT ON COLUMN public.fixture_exafam.promocion IS 'Equipo local';
COMMENT ON COLUMN public.fixture_exafam.vs_promocion IS 'Equipo visitante';
COMMENT ON COLUMN public.fixture_exafam.fecha_partido IS 'Fecha y hora del partido';
COMMENT ON COLUMN public.fixture_exafam.campo_id IS 'ID del campo de juego';
COMMENT ON COLUMN public.fixture_exafam.n_fecha_jugada IS 'Número de fecha/jornada';
COMMENT ON COLUMN public.fixture_exafam.por_jugar IS 'Indica si el partido está pendiente';

-- Match results
CREATE TABLE IF NOT EXISTS public.resultado_fixture (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fixture_id BIGINT REFERENCES public.fixture_exafam(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    resultado TEXT,
    ganador_id BIGINT REFERENCES public.promocion_participante(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

COMMENT ON TABLE public.resultado_fixture IS 'Resultados de los partidos';
COMMENT ON COLUMN public.resultado_fixture.resultado IS 'Resultado del partido (ej: 2-1, 3-0)';
COMMENT ON COLUMN public.resultado_fixture.ganador_id IS 'ID del equipo ganador';

-- League standings (Football)
CREATE TABLE IF NOT EXISTS public.tabla_posicion (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    grupo_id BIGINT NOT NULL REFERENCES public.grupos_promociones(id) ON DELETE RESTRICT,
    promocion BIGINT REFERENCES public.promocion_participante(id) ON UPDATE CASCADE ON DELETE CASCADE,
    puntos INTEGER DEFAULT 0,
    pj INTEGER DEFAULT 0,
    pg INTEGER DEFAULT 0,
    pe INTEGER DEFAULT 0,
    pp INTEGER DEFAULT 0,
    goles_f INTEGER DEFAULT 0,
    goles_c INTEGER DEFAULT 0,
    diferencia_goles INTEGER DEFAULT 0,
    CONSTRAINT tabla_stats_positive CHECK (
        puntos >= 0 AND pj >= 0 AND pg >= 0 AND 
        pe >= 0 AND pp >= 0 AND goles_f >= 0 AND goles_c >= 0
    ),
    CONSTRAINT tabla_partidos_sum CHECK (pj = pg + pe + pp),
    CONSTRAINT tabla_diferencia_goles CHECK (diferencia_goles = goles_f - goles_c)
);

COMMENT ON TABLE public.tabla_posicion IS 'Tabla de posiciones para fútbol';
COMMENT ON COLUMN public.tabla_posicion.puntos IS 'Puntos acumulados';
COMMENT ON COLUMN public.tabla_posicion.pj IS 'Partidos jugados';
COMMENT ON COLUMN public.tabla_posicion.pg IS 'Partidos ganados';
COMMENT ON COLUMN public.tabla_posicion.pe IS 'Partidos empatados';
COMMENT ON COLUMN public.tabla_posicion.pp IS 'Partidos perdidos';
COMMENT ON COLUMN public.tabla_posicion.goles_f IS 'Goles a favor';
COMMENT ON COLUMN public.tabla_posicion.goles_c IS 'Goles en contra';
COMMENT ON COLUMN public.tabla_posicion.diferencia_goles IS 'Diferencia de goles';

-- Volleyball standings
CREATE TABLE IF NOT EXISTS public.voley_posicion (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    promocion BIGINT NOT NULL REFERENCES public.promocion_participante(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    deporte_id BIGINT NOT NULL,
    puntos INTEGER NOT NULL DEFAULT 0,
    partidos_j INTEGER DEFAULT 0,
    partidos_g INTEGER DEFAULT 0,
    partidos_p INTEGER DEFAULT 0,
    CONSTRAINT voley_stats_positive CHECK (
        puntos >= 0 AND partidos_j >= 0 AND 
        partidos_g >= 0 AND partidos_p >= 0
    ),
    CONSTRAINT voley_partidos_sum CHECK (partidos_j = partidos_g + partidos_p)
);

COMMENT ON TABLE public.voley_posicion IS 'Tabla de posiciones para voleibol';
COMMENT ON COLUMN public.voley_posicion.partidos_j IS 'Partidos jugados';
COMMENT ON COLUMN public.voley_posicion.partidos_g IS 'Partidos ganados';
COMMENT ON COLUMN public.voley_posicion.partidos_p IS 'Partidos perdidos';

-- =====================================================
-- SANCTIONS & USERS
-- =====================================================

-- Sanction types
CREATE TABLE IF NOT EXISTS public.tipo_sancion (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre_tipo TEXT NOT NULL,
    cantidad_fecha TEXT,
    CONSTRAINT tipo_sancion_nombre_not_empty CHECK (LENGTH(TRIM(nombre_tipo)) > 0)
);

COMMENT ON TABLE public.tipo_sancion IS 'Tipos de sanciones disponibles';
COMMENT ON COLUMN public.tipo_sancion.nombre_tipo IS 'Nombre del tipo de sanción';
COMMENT ON COLUMN public.tipo_sancion.cantidad_fecha IS 'Cantidad de fechas de suspensión';

-- Sanctioned players list
CREATE TABLE IF NOT EXISTS public.lista_jugador_sancionado (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    motivo_sancion TEXT,
    estado_sancion BOOLEAN DEFAULT TRUE,
    monto_sancion NUMERIC(10,2) DEFAULT 0,
    estado_pago_sancion BOOLEAN DEFAULT FALSE,
    cant_tarjeta_amarilla INTEGER DEFAULT 0,
    cant_tarjeta_roja INTEGER DEFAULT 0,
    promocion_id BIGINT REFERENCES public.promocion_participante(id) ON DELETE RESTRICT,
    tipo_sancion BIGINT REFERENCES public.tipo_sancion(id) ON DELETE RESTRICT,
    nombre_promocion TEXT,
    ultima_fecha INTEGER,
    n_fecha INTEGER DEFAULT 0,
    CONSTRAINT sancion_monto_positive CHECK (monto_sancion >= 0),
    CONSTRAINT sancion_tarjetas_positive CHECK (
        cant_tarjeta_amarilla >= 0 AND cant_tarjeta_roja >= 0
    )
);

COMMENT ON TABLE public.lista_jugador_sancionado IS 'Lista de jugadores sancionados';
COMMENT ON COLUMN public.lista_jugador_sancionado.motivo_sancion IS 'Motivo de la sanción';
COMMENT ON COLUMN public.lista_jugador_sancionado.estado_sancion IS 'Estado activo/inactivo de la sanción';
COMMENT ON COLUMN public.lista_jugador_sancionado.monto_sancion IS 'Monto de la multa';
COMMENT ON COLUMN public.lista_jugador_sancionado.estado_pago_sancion IS 'Estado del pago de la multa';
COMMENT ON COLUMN public.lista_jugador_sancionado.cant_tarjeta_amarilla IS 'Cantidad de tarjetas amarillas';
COMMENT ON COLUMN public.lista_jugador_sancionado.cant_tarjeta_roja IS 'Cantidad de tarjetas rojas';

-- User roles
CREATE TABLE IF NOT EXISTS public.usuario (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rol TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT usuario_rol_not_empty CHECK (LENGTH(TRIM(rol)) > 0),
    CONSTRAINT usuario_user_id_unique UNIQUE (user_id)
);

COMMENT ON TABLE public.usuario IS 'Roles de usuarios del sistema';
COMMENT ON COLUMN public.usuario.rol IS 'Rol del usuario (admin, organizador, etc.)';

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Campeonato indexes
CREATE INDEX IF NOT EXISTS idx_campeonato_user_id ON public.campeonato(user_id);
CREATE INDEX IF NOT EXISTS idx_campeonato_created_at ON public.campeonato(created_at DESC);

-- Promocion participante indexes
CREATE INDEX IF NOT EXISTS idx_promocion_campeonato_id ON public.promocion_participante(campeonato_id);
CREATE INDEX IF NOT EXISTS idx_promocion_grupo_id ON public.promocion_participante(grupo_id);
CREATE INDEX IF NOT EXISTS idx_promocion_estado ON public.promocion_participante(estado);

-- Promocionales indexes
CREATE INDEX IF NOT EXISTS idx_promocionales_participante ON public.promocionales(id_promocion_participante);

-- Fixture indexes
CREATE INDEX IF NOT EXISTS idx_fixture_grupo_id ON public.fixture_exafam(grupo_id);
CREATE INDEX IF NOT EXISTS idx_fixture_fecha_partido ON public.fixture_exafam(fecha_partido);
CREATE INDEX IF NOT EXISTS idx_fixture_por_jugar ON public.fixture_exafam(por_jugar);
CREATE INDEX IF NOT EXISTS idx_fixture_deporte_id ON public.fixture_exafam(deporte_id);

-- Resultado fixture indexes
CREATE INDEX IF NOT EXISTS idx_resultado_fixture_id ON public.resultado_fixture(fixture_id);
CREATE INDEX IF NOT EXISTS idx_resultado_ganador_id ON public.resultado_fixture(ganador_id);

-- Tabla posicion indexes
CREATE INDEX IF NOT EXISTS idx_tabla_grupo_id ON public.tabla_posicion(grupo_id);
CREATE INDEX IF NOT EXISTS idx_tabla_promocion ON public.tabla_posicion(promocion);
CREATE INDEX IF NOT EXISTS idx_tabla_puntos ON public.tabla_posicion(puntos DESC);

-- Voley posicion indexes
CREATE INDEX IF NOT EXISTS idx_voley_promocion ON public.voley_posicion(promocion);
CREATE INDEX IF NOT EXISTS idx_voley_deporte_id ON public.voley_posicion(deporte_id);

-- Sancionados indexes
CREATE INDEX IF NOT EXISTS idx_sancionado_promocion_id ON public.lista_jugador_sancionado(promocion_id);
CREATE INDEX IF NOT EXISTS idx_sancionado_tipo ON public.lista_jugador_sancionado(tipo_sancion);
CREATE INDEX IF NOT EXISTS idx_sancionado_estado ON public.lista_jugador_sancionado(estado_sancion);

-- Usuario indexes
CREATE INDEX IF NOT EXISTS idx_usuario_user_id ON public.usuario(user_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_campeonato_updated_at BEFORE UPDATE ON public.campeonato
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grupos_updated_at BEFORE UPDATE ON public.grupos_promociones
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promocion_updated_at BEFORE UPDATE ON public.promocion_participante
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promocionales_updated_at BEFORE UPDATE ON public.promocionales
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fixture_updated_at BEFORE UPDATE ON public.fixture_exafam
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resultado_updated_at BEFORE UPDATE ON public.resultado_fixture
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tabla_updated_at BEFORE UPDATE ON public.tabla_posicion
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voley_updated_at BEFORE UPDATE ON public.voley_posicion
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tipo_sancion_updated_at BEFORE UPDATE ON public.tipo_sancion
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sancionado_updated_at BEFORE UPDATE ON public.lista_jugador_sancionado
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usuario_updated_at BEFORE UPDATE ON public.usuario
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.campeonato ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupos_promociones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promocion_participante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promocionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixture_exafam ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resultado_fixture ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tabla_posicion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voley_posicion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipo_sancion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lista_jugador_sancionado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;

-- Campeonato policies
CREATE POLICY "Campeonatos are viewable by everyone" ON public.campeonato
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own campeonatos" ON public.campeonato
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campeonatos" ON public.campeonato
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campeonatos" ON public.campeonato
    FOR DELETE USING (auth.uid() = user_id);

-- Grupos promociones policies (public read, authenticated write)
CREATE POLICY "Grupos are viewable by everyone" ON public.grupos_promociones
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert grupos" ON public.grupos_promociones
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update grupos" ON public.grupos_promociones
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Promocion participante policies
CREATE POLICY "Promociones are viewable by everyone" ON public.promocion_participante
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert promociones" ON public.promocion_participante
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update promociones" ON public.promocion_participante
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Promocionales policies
CREATE POLICY "Promocionales are viewable by everyone" ON public.promocionales
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage promocionales" ON public.promocionales
    FOR ALL USING (auth.role() = 'authenticated');

-- Fixture policies
CREATE POLICY "Fixtures are viewable by everyone" ON public.fixture_exafam
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage fixtures" ON public.fixture_exafam
    FOR ALL USING (auth.role() = 'authenticated');

-- Resultado fixture policies
CREATE POLICY "Resultados are viewable by everyone" ON public.resultado_fixture
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage resultados" ON public.resultado_fixture
    FOR ALL USING (auth.role() = 'authenticated');

-- Tabla posicion policies
CREATE POLICY "Tabla posicion is viewable by everyone" ON public.tabla_posicion
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tabla posicion" ON public.tabla_posicion
    FOR ALL USING (auth.role() = 'authenticated');

-- Voley posicion policies
CREATE POLICY "Voley posicion is viewable by everyone" ON public.voley_posicion
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage voley posicion" ON public.voley_posicion
    FOR ALL USING (auth.role() = 'authenticated');

-- Tipo sancion policies
CREATE POLICY "Tipo sancion is viewable by everyone" ON public.tipo_sancion
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tipo sancion" ON public.tipo_sancion
    FOR ALL USING (auth.role() = 'authenticated');

-- Lista jugador sancionado policies
CREATE POLICY "Sancionados are viewable by everyone" ON public.lista_jugador_sancionado
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage sancionados" ON public.lista_jugador_sancionado
    FOR ALL USING (auth.role() = 'authenticated');

-- Usuario policies
CREATE POLICY "Users can view their own usuario record" ON public.usuario
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all usuarios" ON public.usuario
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select to anonymous users (read-only access)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant all privileges to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
