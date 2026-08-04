import api from "@/shared/services/axios";


import type {
  ProjectCategory,
  CreateProjectCategoryDto,
  UpdateProjectCategoryDto,
} from "../types/project-category.types";



interface ApiResponse<T> {

  success: boolean;

  statusCode: number;

  message: string;

  data: T;

  timestamp: string;

  path: string;

}




interface ProjectCategoryListResponse {

  categories: ProjectCategory[];

}




/**
 * Get Project Categories
 */
export const getProjectCategories =
async (): Promise<ProjectCategoryListResponse> => {

  const { data } =
    await api.get<
      ApiResponse<ProjectCategoryListResponse>
    >(
      "/project-categories",
    );


  return data.data;

};





/**
 * Get Project Category By UUID
 */
export const getProjectCategoryByUuid =
async (
  uuid: string,
): Promise<{
  category: ProjectCategory;
}> => {

  const { data } =
    await api.get<
      ApiResponse<{
        category: ProjectCategory;
      }>
    >(
      `/project-categories/${uuid}`,
    );


  return data.data;

};





/**
 * Create Project Category
 */
export const createProjectCategory =
async (
  payload: CreateProjectCategoryDto,
): Promise<{
  category: ProjectCategory;
}> => {

  const { data } =
    await api.post<
      ApiResponse<{
        category: ProjectCategory;
      }>
    >(
      "/project-categories",
      payload,
    );


  return data.data;

};





/**
 * Update Project Category
 */
export const updateProjectCategory =
async (
  uuid: string,

  payload: UpdateProjectCategoryDto,

): Promise<{
  category: ProjectCategory;
}> => {

  const { data } =
    await api.patch<
      ApiResponse<{
        category: ProjectCategory;
      }>
    >(
      `/project-categories/${uuid}`,

      payload,
    );


  return data.data;

};





/**
 * Delete Project Category
 */
export const deleteProjectCategory =
async (
  uuid: string,
): Promise<void> => {

  await api.delete(
    `/project-categories/${uuid}`,
  );

};