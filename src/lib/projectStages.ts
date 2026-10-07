import type { ProjectStage, RegistryMapProject } from '../types/domain';
export const PROJECT_STAGE_LABELS: Record<ProjectStage,string> = {
 operating:'Operating',construction:'Under construction','pre-construction':'Pre-construction',announced:'Announced',shelved:'Shelved',cancelled:'Cancelled',mothballed:'Mothballed',retired:'Retired',mixed_stage:'Multiple stages',other:'Stage unresolved',
};
export const PROJECT_STAGE_COLORS: Record<ProjectStage,string> = {
 operating:'#238266',construction:'#c28b2e','pre-construction':'#408ba1',announced:'#8c72a3',shelved:'#92948e',cancelled:'#ae6254',mothballed:'#8e7966',retired:'#687578',mixed_stage:'#4f677b',other:'#a7aaa3',
};
export function stageText(project:RegistryMapProject) {return PROJECT_STAGE_LABELS[project.projectStage];}
