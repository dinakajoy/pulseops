export type OrganizationStatus = "active" | "suspended" | "archived";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  ownerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationInput {
  name: string;
  slug?: string;
  ownerEmail: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
  ownerEmail?: string;
}

export interface OrganizationRepository {
  create(input: CreateOrganizationInput): Promise<Organization>;

  findById(id: string): Promise<Organization | null>;

  findBySlug(slug: string): Promise<Organization | null>;

  update(id: string, input: UpdateOrganizationInput): Promise<Organization>;

  updateStatus(id: string, status: OrganizationStatus): Promise<Organization>;

  delete(id: string): Promise<void>;
}
