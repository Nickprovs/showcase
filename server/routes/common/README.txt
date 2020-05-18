Sometimes, we have models with identical schema whose routes work in the same way, yet they are stored in different collections.
In these cases, what we can do is define a route as a function that takes the Model/Schemas in as parameters.
Since the Model defines the name of the collection, this route code can be reused for different endpoints with different collections.

In our case, we have a few common route modules.

1.) Categories
    Categories are just a named category. Articles, Software Projects, Photos, and Medias can all have categories.
    That said, the articleCategory endpoint works exactly the same as the photoCategory endpoint.

2.) Articles 
    In our case, an article model can represent a standard article or it can represent a software project.

These common route modules are registed in index.js with different endpoints and different models.