export const eventResponseMapper = (results) => {
    const mappedResults = results.map( result =>{
        return {
            "_id": result._id,
            "title": result.title,
            "description": result.description,
            "author": result.author,
            "likes": result.likes.length || 0,
            "comments": result.likes.length || 0,
        }
    })
    console.log(mappedResults)
    return mappedResults
}