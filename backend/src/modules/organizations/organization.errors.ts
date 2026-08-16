export class OrganizationNotFoundError extends Error {
  constructor(id: string) {
    super(`Organization '${id}' was not found`);
    this.name = "OrganizationNotFoundError";
  }
}

export class OrganizationSlugAlreadyExistsError extends Error {
  constructor(slug: string) {
    super(`Organization slug '${slug}' already exists`);
    this.name = "OrganizationSlugAlreadyExistsError";
  }
}
