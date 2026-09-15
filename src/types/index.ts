export type JobCategory = "Construction" | "Manufacturing" | "Logistics" | "Hospitality" | "IT" | "Drivers" | "Other";

export type EmploymentType = "Full-time" | "Part-time" | "Freelance" | "Temporary" | "Internship";

export interface Vacancy {
  id: string,
  title: string,
  partnerSlug: string,
  partnerName: string,
  category: JobCategory,
  location: string,
  salary: string,
  type: EmploymentType,
  description: string,
  requirements: string[],
  createdAt: string,
}

export type AbsoluteURL = `http://${string}` | `https://${string}`;

export interface Partner {
  slug: string,
  name: string,
  logo?: string,
  category: JobCategory,
  location: string,
  description: string,
  website?: AbsoluteURL,
  vacanciesCount: number,
}

export interface ApplicationForm {
  name: string,
  tel: string,
  message?: string,
}