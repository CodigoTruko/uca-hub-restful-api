export const getNext = (pathUrl, skip, limit, count) => {
    let newSkip;
    let newLimit;
    if(skip+limit < count){
        newSkip = skip + limit;
        if(newSkip + limit <= count){
            newLimit = limit;
        }else{
            newLimit = count - (newSkip+limit);
            
        }
        return `${pathUrl}?skip=${newSkip}&limit=${newLimit}`
    } else{
        return null
    }
    return "ultimo return"
    /* if(count < skip+limit) return null
    if(count = skip+limit) 

    const nextUrl = ""
    return nextUrl; */
}

export const getPrevious = (pathUrl, skip, limit, count) => {
    let newSkip;
    let newLimit;

    if(skip == 0){
        return null
    }
    if(skip-limit > 0){
        newSkip = skip-limit;
        newLimit = limit;
        
    } 
    if(skip-limit == 0){
        newSkip = 0;
        newLimit = limit;
    }
    if(skip-limit < 0){
        newSkip = 0;
        newLimit = skip;

    }
    return `${pathUrl}?skip=${newSkip}&limit=${newLimit}`
}