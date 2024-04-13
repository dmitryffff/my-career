import { capitalize } from '../helpers'

export const ERROR_MESSAGES = {
  SERVER_ERROR: 'Ошибка сервера',
  /** Returns a message that `some-entity-name` with `value-name` already exists */
  EXISTS: (entityName: string, propName: string) =>
    `${capitalize(entityName)} с таким значением поля '${propName}' уже существует`,
}
