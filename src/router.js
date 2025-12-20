import * as Feed  from './feed.js';
import * as Asset from './asset.js';
import * as Submit from './submit.js';

export async function route(request, env, ctx) {
  const requestURL = new URL(request.url);
  
  // TODO: Check for key parameter to authenticate
  
  if        (Feed.isFeed(request))            {
    console.log(`[router.js] Feed.getFeed()`);
    return Feed.getFeed(request, env, ctx);
  } else if (Asset.isAsset(request))          { 
    console.log(`[router.js] Asset.getAsset()`);
    return Asset.getAsset(request, env, ctx);
  } else if (Submit.isSubmit(request))        {
    console.log(`[router.js] Submit.getPage()`);
    return Submit.getPage(request);
  }
  
  console.log(`[router.js] Submit.getForm()`);
  return Submit.getForm()
}