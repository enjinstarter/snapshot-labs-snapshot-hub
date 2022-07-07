import { getAddress } from '@ethersproject/address';
import snapshot from '@snapshot-labs/snapshot.js';
import db from '../../helpers/mysql';
import { jsonParse } from '../../helpers/utils';

export async function verify(body): Promise<any> {
  console.log('[newDelegationRequest verify]', body);
  // TODO: Add more checks

  // const profile = jsonParse(body.profile, {});
  // const schemaIsValid = snapshot.utils.validateSchema(
  //   snapshot.schemas.profile,
  //   profile
  // );
  // if (schemaIsValid !== true) {
  //   console.log('[writer] Wrong profile format', schemaIsValid);
  //   return Promise.reject('wrong profile format');
  // }

  return true;
}

export async function action(message, ipfs): Promise<void> {
  const delegator = getAddress(message.from);
  const delegate = getAddress(message.delegate);

  let delegateRequestData: any = {};
  if (parseInt(message.requestId) > 0) {
    const [
      data
    ] = await db.queryAsync('SELECT * FROM delegation_request WHERE id = ?', [
      message.requestId
    ]);
    delegateRequestData = data;
  }

  // Check if delegator is already a delegate
  const data = await db.queryAsync(
    'SELECT * FROM delegations WHERE currentDelegate = ? order by created DESC',
    [delegator]
  );

  console.log(data);
  let query = '';
  const params: any = [];
  if (data?.length > 0) {
    query += 'UPDATE delegations SET currentDelegate = ? WHERE id in (?); ';
    params.push(
      delegate,
      data.map(a => a.id)
    );
  }

  params.push({
    created: message.timestamp,
    space: message.space,
    delegator,
    delegate: getAddress(message.delegate),
    currentDelegate: getAddress(message.delegate),
    price: delegateRequestData.rewardPriceOffer || 'None',
    ipfs
  });

  await db.queryAsync(query + 'INSERT INTO delegations SET ?', params);
  console.log(`[writer] Stored: ${message.from} Added new request`);
}
