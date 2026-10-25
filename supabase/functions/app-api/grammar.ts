import { grammarRequest } from '../../../apps/web/src/domain/grammar.js';
export async function grammarApi(admin:any,user:{id:string},path:string,method:string,body:any) {
    const request=grammarRequest(path,method,body);
    if(!request)return undefined;
    const result=await admin.rpc('app_grammar_api',{p_user:user.id,p_action:request.action,p_id:request.id,p_payload:request.payload});
    if(result.error)throw Object.assign(new Error(result.error.message),{status:result.error.code==='P0002'?404:400});
    return result.data;
}
