import {
  OrganizationNotFoundError,
  OrganizationSlugAlreadyExistsError,
} from "./organization.errors";

import {
  CreateOrganizationInput,
  Organization,
  OrganizationRepository,
  OrganizationStatus,
  UpdateOrganizationInput,
} from "./organization.types";

import { generateSlug } from "../../shared/utils";

export class OrganizationService {
  constructor(private readonly repository: OrganizationRepository) {}

  async create(input: CreateOrganizationInput): Promise<Organization> {
    const slug = input.slug ? input.slug : generateSlug(input.name);
    if (!slug) {
      throw new Error("Unable to generate organization slug");
    }

    const existing = await this.repository.findBySlug(slug);
    if (existing) {
      throw new OrganizationSlugAlreadyExistsError(slug);
    }

    return this.repository.create({
      name: input.name,
      slug,
      ownerEmail: input.ownerEmail,
    });
  }

  async getById(id: string): Promise<Organization> {
    const organization = await this.repository.findById(id);

    if (!organization) {
      throw new OrganizationNotFoundError(id);
    }

    return organization;
  }

  async getBySlug(slug: string): Promise<Organization> {
    const organization = await this.repository.findBySlug(slug);

    if (!organization) {
      throw new OrganizationNotFoundError(slug);
    }

    return organization;
  }

  async update(
    id: string,
    input: UpdateOrganizationInput,
  ): Promise<Organization> {
    const organization = await this.repository.findById(id);
    if (!organization) {
      throw new OrganizationNotFoundError(id);
    }

    const slug = input.slug;
    if (slug && slug !== organization.slug) {
      const existing = await this.repository.findBySlug(slug);

      if (existing && existing.id !== id) {
        throw new OrganizationSlugAlreadyExistsError(slug);
      }
    }

    return this.repository.update(id, {
      name: input.name,
      slug,
      ownerEmail: input.ownerEmail,
    });
  }

  async updateStatus(
    id: string,
    status: OrganizationStatus,
  ): Promise<Organization> {
    const organization = await this.repository.findById(id);

    if (!organization) {
      throw new OrganizationNotFoundError(id);
    }

    return this.repository.updateStatus(id, status);
  }
}
