import * as Feed  from './feed';
import * as Asset from './asset';
import * as Submit from './submit';

export async function route(request, env, ctx) {
  const requestURL = new URL(request.url);
  
  // TODO: Check for key parameter to authenticate
  
  if        (Feed.isFeed(request))            {
    return Feed.getFeed(request, env, ctx);
  } else if (Asset.isAsset(request))          { 
    return Asset.getAsset(request, env, ctx);
  } else if (Submit.isSubmit(request))        {
    return Submit.getPage(request);
  }
  
  console.log(`[index.js] fallback`);
  return Submit.getForm()
}