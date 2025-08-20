import { 
    municipal_dependency_enum,
    priority_level_enum, 
    role_enum, 
    ticket_status_enum
} from '@prisma/client';

export const TicketStatusLabels: Record<ticket_status_enum, string> = {
  [ticket_status_enum.Pendiente]: 'Pendiente',
  [ticket_status_enum.V_lido]: 'Válido',
  [ticket_status_enum.Programada]: 'Programada',
  [ticket_status_enum.Resuelto]: 'Resuelto',
  [ticket_status_enum.Finalizado]: 'Finalizado',
  [ticket_status_enum.Cuestionada]: 'Cuestionada',
  [ticket_status_enum.Rechazado]: 'Rechazado',
  [ticket_status_enum.Derivado]: 'Derivado',
  [ticket_status_enum.Cancelado]: 'Cancelado',
};


export const PriorityLevelLabels: Record<priority_level_enum, string> = {
  [priority_level_enum.Muy_Alta]: 'Muy Alta',
  [priority_level_enum.Alta]: 'Alta',
  [priority_level_enum.Media]: 'Media',
  [priority_level_enum.Baja]: 'Baja',
};


export const RoleLabels: Record<role_enum, string> = {
  [role_enum.operador_atencion_vecino]: 'Operador de Atención al vecino',
  [role_enum.ciudadano]: 'Ciudadano',
  [role_enum.responsable_dependencia]: 'Responsable de dependencia',
  [role_enum.miembro_cuadrilla]: 'Miembro de cuadrilla',
};

export const DependencyLabels: Record<municipal_dependency_enum, string> = {
  [municipal_dependency_enum.Arboldado_urbano]: 'Arboldado urbano',
  [municipal_dependency_enum.Alumbrado_p_blico]: 'Alumbrado público',
  [municipal_dependency_enum.Mantenimiento_de_cloaca_y_agua_potable]: 'Mantenimiento de cloaca y agua potable',
  [municipal_dependency_enum.Recolecci_n_de_residuos]: 'Recolección de residuos',
  [municipal_dependency_enum.Liempieza_de_calles]: 'Limpieza de calles',
  [municipal_dependency_enum.Distribuci_n_de_reigo_y_agua_potable]: 'Distribución de riego y agua potable',
  [municipal_dependency_enum.Control_urbano_y_de_tr_nsito]: 'Control urbano y de tránsito',
  [municipal_dependency_enum.Veh_culos_abandonados]: 'Vehículos abandonados',
  [municipal_dependency_enum.Conservaci_n_de_espacios_p_blicos]: 'Conservación de espacios públicos',
  [municipal_dependency_enum.Atenci_n_sanitaria_de_animales]: 'Atención sanitaria de animales',
  [municipal_dependency_enum.Control_industrial_y_de_plagas]: 'Control industrial y de plagas',
};