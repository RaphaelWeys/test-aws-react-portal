interface Buttons {
  label: string;
  action: string;
  downloadable: boolean;
}

interface Checkboxes {
  label: string;
  key: string;
}

export interface Template {
  app: string;
  language: string;
  name: string;
  template: string;
  preview: {
    type: string;
    backend: string;
    documentLabel: string;
    documentType: string;
    buttons: Buttons[];
    checkboxes: Checkboxes[];
  };
}

export interface TemplateAction {
  filename: string;
}
