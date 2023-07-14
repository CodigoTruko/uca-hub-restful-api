export const eventResponseMapper = (results, user) => {
    console.log("HI IM THE RESPONSE MAPPER")
    
    const mappedResults = results.map( result =>{
        return {
            "_id": result._id,
            "title": result.title,
            "description": result.description,
            "author": result.author,
            "likes": result.likes.length || 0,
            /* "isLiked": isLiked,
            "isBookmarked": isBookmarked, */
            "comments": result.likes.length || 0,
        }
    })
    console.log(mappedResults)
    return mappedResults
}