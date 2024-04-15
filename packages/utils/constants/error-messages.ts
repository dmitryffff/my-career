import { capitalize } from '../helpers'

const CRUD_ACTIONS = {
  create: 'создать',
  read: 'получить',
  update: 'обновить',
  delete: 'удалить',
} as const

export const ERROR_MESSAGES = {
  SERVER_ERROR: 'Ошибка сервера.',
  EXISTS: (entityName: string, propName: string) =>
    `${capitalize(entityName)} с таким значением поля '${propName}' уже существует.`,
  DOES_NOT_EXISTS: (entityName: string, propName: string) =>
    `${capitalize(entityName)} с таким значением поля '${propName}' не существует.`,
  CANT_CRUD: (
    action: keyof typeof CRUD_ACTIONS,
    entityName: string,
    propName: string,
    info?: string,
  ) =>
    `Невозможно ${CRUD_ACTIONS[action]} запись типа ${entityName} с таким значением поля '${propName}.'${info === undefined ? '' : `\nПричина: ${info}.`}`,
}
