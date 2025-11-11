// Resource types for the web application (camelCase naming convention)

export type LinkListType = 'link' | 'card-link' | 'pdf-link';

export interface Link {
  title: string;
  link: string;
  description?: string;
  header?: string;
  fileType?: string;
}

export interface LinkList {
  name: string;
  type: LinkListType;
  priority: number;
  links: Link[];
}

export interface Resource {
  id: string;
  key: string;
  name: string;
  header: string;
  shortDescription: string;
  body: string;
  linkList: LinkList[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceApiResponse {
  status: 'success' | 'error';
  data?: {
    resource: Resource | null;
  };
  message?: string;
}
