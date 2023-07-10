export const eventResponseMapper = (results) => {
    const mappedResults = results.map( result =>{
        return {
            "_id": result._id,
            "title": result.title,
            "description": result.description,
            "author": result.author,
            "likes": result.likesCount || 0,
            "comments": result.commentsCount || 0,
        }
    })

    return mappedResults
}