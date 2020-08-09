const graphql = require('graphql');
const _= require('lodash')
const Book = require('../models/book')
const Author = require('../models/author')
const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList} = graphql
//mencari id dari suatu data di dalam databse bisa menggunakan GraphQLID / GraphQLString (dan bisa juga dendgan GraphqlInt jika di db type dari id int), kalau menggunakan GraphQLID kita bisa memasukkan string atau int sebagai parameter untuk mencari data. (pada dasarnya yang digunakan tetaplah string, hanya saja yang merubahnya adalah Graphql)
//  authorId digunakan untuk menghubungkan books dengan author(semacam foreign key)
// var books = [
//     {name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1'},
//     {name: 'The Final Empire', genre: 'Fantasy', id:'2', authorId: '2'},
//     { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
//     {name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3'},
//     { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
//     { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' }
    
// ]

// var authors = [
//     {name: 'Patrick Rothfuss', age: 44, id: '1'},
//     {name: 'Brandon Sanderson', age: 42, id: '2'},
//     {name: 'Terry Pratchett', age: 66, id: '3'}
// ]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            // parent argument berisi data dari Book {name: , genre: , id: , authorId: }
            // saat book sudah ketemu datanya akan masuk ke dalam parent dan bisa di akses dengan menggunakan argument parent
            // digunakan untuk mencari nested data
            
            resolve(parent, args){
                // _.find hanya akan return yang pertama kali ketemu(match)
                // return _.find(authors, {id : parent.authorId})
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        book: {
            // type bukan BookType, karena seorang author mungkin punya lebih dari satu buku
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // akan return semua yang match
                // return _.filter(books, {authorId: parent.id})
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                // code to get data from db / other source
                // menggunakan lodash
                // return _.find(books, { id: args.id})
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                // return _.find(authors, {id: args.id})
            }
        },
        // to get all the books
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args:{
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})