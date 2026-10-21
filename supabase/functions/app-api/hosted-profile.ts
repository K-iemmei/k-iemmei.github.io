const checked = (result: any) => {
    if (result.error) throw new Error(result.error.message);
    return result.data;
};

export async function ensureHostedProfile(admin: any, user: any) {
    const member = checked(await admin.from('hosted_members').select('user_id').eq('user_id', user.id).maybeSingle());
    if (!member) return false;
    const profile = checked(await admin.from('users').select('id,name').eq('id', user.id).maybeSingle());
    const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'Learner';
    if (!profile) {
        // Several panels may make their first request together. A concurrent insert is success.
        checked(await admin.from('users').upsert({id:user.id,email:user.email,name:displayName,username:null}, {onConflict:'id',ignoreDuplicates:true}));
    } else if (profile.name === 'Local Developer') {
        checked(await admin.from('users').update({name:displayName}).eq('id',user.id).eq('name','Local Developer'));
    }
    return true;
}
