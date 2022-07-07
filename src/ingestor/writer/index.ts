import * as proposal from './proposal';
import * as vote from './vote';
import * as settings from './settings';
import * as deleteProposal from './delete-proposal';
import * as follow from './follow';
import * as unfollow from './unfollow';
import * as alias from './alias';
import * as subscribe from './subscribe';
import * as unsubscribe from './unsubscribe';
import * as profile from './profile';
import * as newDelegationRequest from './new-delegation-request';
import * as delegateTo from './delegate-to';

export default {
  proposal,
  vote,
  settings,
  'delete-proposal': deleteProposal,
  follow,
  unfollow,
  subscribe,
  unsubscribe,
  alias,
  profile,
  'new-delegation-request': newDelegationRequest,
  'delegate-to': delegateTo
};
