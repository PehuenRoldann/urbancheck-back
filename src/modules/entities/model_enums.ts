import { registerEnumType } from '@nestjs/graphql';

export enum RoleEnum {
  CITIZEN = 'Citizen',
  SUPPORT_OPERATOR = 'Neighborhood Support Operator',
  DEPARTMENT_MANAGER = 'Department Manager',
  CREW_MEMBER = 'Crew Member',
}

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
  description: 'System user roles',
});

export enum MunicipalDependencyEnum {
  TREE_MANAGEMENT = 'TreeManagement',
  GREEN_AREAS = 'GreenAreas',
  STREET_CLEANING = 'StreetCleaning',
  STREET_MAINTENANCE = 'StreetMaintenance',
  ELECTROTECHNICS = 'Electrotechnics',
  PUBLIC_SPACES = 'PublicSpaces',
  ILLEGAL_DUMPING = 'IllegalDumping',
  PRIVATE_WORKS = 'PrivateWorks',
  PUBLIC_WORKS = 'PublicWorks',
  SANITARY_WORKS_OFFICE = 'SanitaryWorksOffice',
  MUNICIPAL_POLICE = 'MunicipalPolice',
  GARBAGE_COLLECTION = 'GarbageCollection',
  WATER_NETWORK = 'WaterNetwork',
  SEWER_NETWORK = 'SewerNetwork',
  IRRIGATION = 'Irrigation',
  ENVIRONMENTAL_HEALTH = 'EnvironmentalHealth',
  TRAFFIC = 'Traffic',
}

registerEnumType(MunicipalDependencyEnum, {
  name: 'MunicipalDependencyEnum',
  description: 'City department or service related to the issue',
});

export enum PriorityLevelEnum {
  VERY_HIGH = 'Very High',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

registerEnumType(PriorityLevelEnum, {
  name: 'PriorityLevelEnum',
  description: 'Level of priority assigned to a ticket',
});
