import db from '../../helpers/mysql';
import { buildWhereQuery } from '../helpers';

export default async function(parent, args) {
  const { where = {} } = args;

  const fields = {
    id: 'string',
    ipfs: 'string',
    created: 'number',
    currentDelegate: 'string',
    delegator: 'string',
    delegate: 'string',
    space: 'string'
  };
  const whereQuery = buildWhereQuery(fields, 'd', where);
  const queryStr = whereQuery.query;
  const params: any[] = whereQuery.params;

  let orderBy = args.orderBy || 'created';
  let orderDirection = args.orderDirection || 'desc';
  if (!['created'].includes(orderBy)) orderBy = 'created';
  orderBy = `d.${orderBy}`;
  orderDirection = orderDirection.toUpperCase();
  if (!['ASC', 'DESC'].includes(orderDirection)) orderDirection = 'DESC';

  let { first = 20 } = args;
  const { skip = 0 } = args;
  if (first > 1000) first = 1000;
  params.push(skip, first);

  let delegations: any[] = [];

  const query = `
    SELECT d.* FROM delegations d
    WHERE 1=1 ${queryStr}
    ORDER BY ${orderBy} ${orderDirection} LIMIT ?, ?
  `;
  try {
    delegations = await db.queryAsync(query, params);
    return delegations;
  } catch (e) {
    console.log('[graphql]', e);
    return Promise.reject('request failed');
  }
}
