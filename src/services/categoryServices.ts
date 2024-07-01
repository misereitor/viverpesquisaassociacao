import { HttpError } from '../errorHandling/custonError';
import Category from '../model/category';
import { ChangeStatus } from '../model/changeStatus';
import CategoryRepository from '../repositiry/categoryRepository';

interface ICategoryServices {
  createCompany(category: Category): Promise<Category>;
  searchAll(): Promise<Category[]>;
  searchById(idCategory: number): Promise<Category>;
  searchByName(name: string): Promise<Category>;
  update(category: Category): Promise<Category>;
  changeStatus(idCategory: number): Promise<void>;
}

class CategoryServices implements ICategoryServices {
  public async createCompany(category: Category): Promise<Category> {
    try {
      const categoryExist = await CategoryRepository.searchByName(
        category.name
      );
      if (categoryExist) {
        throw new HttpError(302, 'Categoria já existe');
      }
      const newCategory = await CategoryRepository.save(category);
      category.id = newCategory;
      return category;
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }

  public async searchAll(): Promise<Category[]> {
    try {
      const allCategories = await CategoryRepository.searchAll();
      return allCategories;
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }

  public async searchById(idCategory: number): Promise<Category> {
    try {
      const category = await CategoryRepository.searchById(idCategory);
      if (!category) {
        throw new HttpError(404, 'Categoria não encontrada');
      }
      return category;
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }

  public async searchByName(name: string): Promise<Category> {
    try {
      const category = await CategoryRepository.searchByName(name);
      if (!category) {
        throw new HttpError(404, 'Categoria não encontrada');
      }
      return category;
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }

  public async update(category: Category): Promise<Category> {
    try {
      await this.searchById(category.id);
      const categoryUpdate = CategoryRepository.update(category);
      return categoryUpdate;
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }

  public async changeStatus(idCategory: number): Promise<void> {
    try {
      const category = await this.searchById(idCategory);
      const changeStatusCategory: ChangeStatus = {
        id: idCategory,
        active: !category.active
      };
      await CategoryRepository.changeStatus(changeStatusCategory);
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }
}

export default new CategoryServices();
