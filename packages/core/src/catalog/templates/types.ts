export type TemplateCategory = 'auth' | 'dashboard' | 'form' | 'marketing' | 'feedback';

export type TemplateLayoutType = 'centered' | 'sidebar' | 'full';

export interface TemplateResponsiveBreakpoint {
  padding: string;
  gap: string;
  columns: number;
}

export interface TemplateResponsiveLayout {
  mobile: TemplateResponsiveBreakpoint;
  tablet: TemplateResponsiveBreakpoint;
  desktop: TemplateResponsiveBreakpoint;
}

export interface TemplateSectionDefinition {
  id: string;
  name: string;
  slot: string;
  required: boolean;
}

export interface TemplateLayoutDefinition {
  type: TemplateLayoutType;
  responsive: TemplateResponsiveLayout;
}

export interface TemplateCustomizableDefinition {
  texts: string[];
  optional: string[];
  slots: string[];
}

export interface ScreenTemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  skeleton: {
    shell: string;
    page: string;
    sections: TemplateSectionDefinition[];
  };
  layout: TemplateLayoutDefinition;
  customizable: TemplateCustomizableDefinition;
  requiredComponents: string[];
  version: string;
  created: string;
  updated: string;
  tags?: string[];
}
