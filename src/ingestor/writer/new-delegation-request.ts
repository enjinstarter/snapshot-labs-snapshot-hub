import { getAddress } from '@ethersproject/address';
import snapshot from '@snapshot-labs/snapshot.js';
import db from '../../helpers/mysql';
import { jsonParse } from '../../helpers/utils';

export async function verify(body): Promise<any> {
  console.log('[newDelegationRequest verify]', body);
  // TODO: Add more checks

  // TODO: check if request is only exists four times
  // (one free and one paid as delegator)
  // (one free and one paid as delegate)

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
  const params = {
    user: getAddress(message.from),
    space: message.space,
    iam: message.iam,
    title: message.title,
    description: message.description,
    rewardPriceOffer: message.rewardPriceOffer,
    maxReward: message.maxReward,
    expires: message.expires,
    created: message.timestamp,
    ipfs
  };

  await db.queryAsync('INSERT INTO delegation_request SET ?', params);
  console.log(`[writer] Stored: ${message.from} Added new request`);
}
