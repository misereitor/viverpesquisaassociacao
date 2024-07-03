import { HttpError } from '../errorHandling/custonError';
import Category from '../model/category';
import { ChangeStatus } from '../model/changeStatus';
import { LogsCategory } from '../model/logs';
import CategoryRepository from '../repositiry/categoryRepository';
import logsServices from './logsServices';

interface ICategoryServices {
  createCompany(category: Category, token: string): Promise<Category>;
  searchAll(): Promise<Category[]>;
  searchById(idCategory: number): Promise<Category>;
  searchByName(name: string): Promise<Category>;
  update(category: Category, token: string): Promise<Category>;
  changeStatus(idCategory: number, token: string): Promise<void>;
}

class CategoryServices implements ICategoryServices {
  public async createCompany(
    category: Category,
    token: string
  ): Promise<Category> {
    try {
      const categoryExist = await CategoryRepository.searchByName(
        category.name
      );
      if (categoryExist) {
        throw new HttpError(302, 'Categoria já existe');
      }
      const newCategory = await CategoryRepository.save(category);
      category.id = newCategory;
      await this.createLogs(category, category, 'create', token);
      return category;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAll(): Promise<Category[]> {
    try {
      const allCategories = await CategoryRepository.searchAll();
      return allCategories;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
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
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
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
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async update(category: Category, token: string): Promise<Category> {
    try {
      const oldCategory = await this.searchById(category.id);
      const categoryUpdate = await CategoryRepository.update(category);
      await this.createLogs(oldCategory, categoryUpdate, 'update', token);
      return categoryUpdate;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async changeStatus(idCategory: number, token: string): Promise<void> {
    try {
      const oldCategory = await this.searchById(idCategory);
      const changeStatusCategory: ChangeStatus = {
        id: idCategory,
        active: !oldCategory.active
      };
      const newCategory =
        await CategoryRepository.changeStatus(changeStatusCategory);
      await this.createLogs(oldCategory, newCategory, 'changeStatus', token);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  private async createLogs(
    oldValue: Category,
    newValue: Category,
    action: string,
    token: string
  ) {
    try {
      const log: LogsCategory = {
        id: 0,
        category_id: newValue.id,
        action: action,
        old_value: oldValue,
        new_value: newValue,
        date: new Date(),
        user_id: 0
      };
      await logsServices.createLogCategory(log, token);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }
}

export default new CategoryServices();
